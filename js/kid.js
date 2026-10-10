/* ============================================================
   「一步一步」— 小朋友端
   畫面：揀頭像 / 今日任務 / 一步一步 / 慶祝 / 星星罐 / 成長地圖 / 圖鑑
   ============================================================ */
(function (global) {
  'use strict';

  var S = global.SBS, ST = global.SBS_STORE, SP = global.SBS_SPEECH, M = global.SBS_MASCOT;

  function view(children) {
    var v = S.el('<div class="view"></div>');
    children.forEach(function (c) { if (c) v.appendChild(c); });
    return v;
  }

  function slotName(id) {
    var s = global.SBS_DATA.SLOTS.find(function (x) { return x.id === id; });
    return s ? S.tx(s.name) : S.tx({ yue: '其他', zh: '其他', en: 'Other' });
  }

  /* ==================== 揀小朋友 ==================== */
  function pickChild() {
    var st = ST.load();
    var kids = st.children;

    var head = S.el(
      '<div class="wrap center" style="padding-top:26px">' +
      M.gin({ scarf: (ST.activeChild() || {}).scarf || '#1F9E94', anim: 'wave', size: 150 }) +
      '<h1 style="font-size:clamp(26px,6.4vw,38px);margin:6px 0 4px;font-weight:900">一步一步</h1>' +
      '<p class="muted" style="margin:0">今日想同 Gin 做咩呢？</p>' +
      '</div>'
    );

    var grid = S.el('<div class="wrap pick-grid"></div>');
    kids.forEach(function (c) {
      var card = S.el(
        '<button class="pick-card">' +
        '<span class="ava">' + c.avatar + '</span>' +
        '<span class="nm">' + S.esc(c.name) + '</span>' +
        '<span class="meta">' + (c.age ? c.age + ' 歲 · ' : '') + ST.totalStars(c.id) + ' ⭐</span>' +
        '</button>'
      );
      card.addEventListener('click', function () {
        st.activeChildId = c.id;
        ST.save();
        SP.speak(c.name + '，我哋開始啦');
        S.go('/kid/home');
      });
      grid.appendChild(card);
    });

    var addBtn = S.el('<button class="pick-card add"><span class="ava">➕</span><span class="nm">加小朋友</span></button>');
    addBtn.addEventListener('click', function () { S.go('/parent/children'); });
    grid.appendChild(addBtn);

    var v = view([head, grid, S.tabbar('home')]);
    v.appendChild(S.voiceFab());
    v.appendChild(S.el('<div style="height:8px"></div>'));
    var lock = S.parentLockButton();
    lock.style.cssText = 'position:fixed;right:14px;bottom:calc(96px + env(safe-area-inset-bottom,0px));z-index:45;opacity:.6';
    v.appendChild(lock);
    return v;
  }

  /* ==================== 今日任務 ==================== */
  function home() {
    var st = ST.load();
    var child = ST.activeChild();
    if (!child) return pickChild();

    var tasks = ST.todayTasks(child.id);
    var key = ST.todayKey();
    var rec = st.completions[key] || {};

    var greeting = greetNow();

    var sayBtn = S.el('<button class="icon-btn small" title="語音">🔊</button>');
    sayBtn.addEventListener('click', function () {
      SP.speak('今日有 ' + tasks.length + ' 個任務，我哋一個一個嚟');
    });
    var head = S.topbar({
      title: greeting + '，' + child.name,
      right: [sayBtn, S.parentLockButton()]
    });

    var body = S.el('<div class="wrap"></div>');

    // Gin 提示
    var doneCount = tasks.filter(function (t) { return rec[t.id] && rec[t.id].done; }).length;
    var ginBox = S.el(
      '<div class="card row" style="gap:16px;align-items:center;margin-top:8px">' +
      '<div style="flex:0 0 92px">' + M.gin({ scarf: child.scarf, anim: 'wave', size: 92 }) + '</div>' +
      '<div class="grow">' +
      '<div style="font-size:20px;font-weight:800">' + ginLine(doneCount, tasks.length) + '</div>' +
      '<div class="small muted mt8">今日完成 ' + doneCount + ' / ' + tasks.length + ' 個任務 · 共 ' + ST.totalStars(child.id) + ' ⭐</div>' +
      '</div></div>'
    );
    body.appendChild(ginBox);

    if (!tasks.length) {
      body.appendChild(S.el(
        '<div class="card center mt16" style="padding:34px 18px">' +
        '<div style="font-size:56px">🌈</div>' +
        '<h3 style="margin:10px 0 6px">今日冇排任務</h3>' +
        '<p class="muted small">請家長喺「任務庫」開啟任務，或者設定返今日嘅時間表。</p>' +
        '</div>'
      ));
    } else {
      var bySlot = {};
      tasks.forEach(function (t) { (bySlot[t.slot] = bySlot[t.slot] || []).push(t); });
      global.SBS_DATA.SLOTS.forEach(function (sl) {
        if (!bySlot[sl.id]) return;
        body.appendChild(S.el('<div class="slot-head"><span>' + sl.icon + '</span><span>' + S.tx(sl.name) + '</span><span class="bar"></span></div>'));
        bySlot[sl.id].forEach(function (t) { body.appendChild(taskCard(t, rec[t.id])); });
      });
    }

    // 圖鑑入口
    body.appendChild(S.el(
      '<div class="row-wrap mt24">' +
      '<a class="btn btn-ghost btn-sm" href="#/kid/book">📖 我完成過嘅任務</a>' +
      '<a class="btn btn-ghost btn-sm" href="#/kid/games">🎮 同 Gin 玩吓</a>' +
      '</div>'
    ));

    var v = view([head, body, S.tabbar('home')]);
    v.appendChild(S.voiceFab());
    return v;
  }

  function greetNow() {
    var h = new Date().getHours();
    if (h < 11) return S.tx({ yue: '早晨', zh: '早安', en: 'Good morning' });
    if (h < 17) return S.tx({ yue: '午安', zh: '午安', en: 'Good afternoon' });
    if (h < 21) return S.tx({ yue: '你好', zh: '你好', en: 'Good evening' });
    return S.tx({ yue: '夜晚好', zh: '晚安', en: 'Good night' });
  }

  function ginLine(done, total) {
    if (total === 0) return S.tx({ yue: '今日自由活動，想玩咩都得！', zh: '今天自由活动，想玩什么都可以！', en: 'A free day — play whatever you like!' });
    if (done === 0) return S.tx({ yue: '揀一個開始啦，我陪住你。', zh: '选一个开始吧，我陪着你。', en: 'Pick one to start — I\'m right here.' });
    if (done < total) return S.tx({ yue: '做得好好，繼續加油！', zh: '做得很好，继续加油！', en: 'Great work, keep going!' });
    return S.tx({ yue: '全部做完啦，你好叻！', zh: '全部做完了，你真棒！', en: 'All done — you are amazing!' });
  }

  function taskCard(t, rec) {
    var total = t.steps.length;
    var doneN = rec ? Object.keys(rec.steps || {}).length : 0;
    var done = rec && rec.done;
    var cls = done ? 'task-card done' : (doneN > 0 ? 'task-card partial' : 'task-card');

    var node = S.el(
      '<button class="' + cls + '">' +
      '<span class="tc-icon">' + t.icon + '</span>' +
      '<span class="grow" style="text-align:left">' +
      '<span class="tc-name" style="display:block">' + S.tx(t.title) + '</span>' +
      '<span class="tc-sub">' +
      '<span>' + t.minutes + ' 分鐘</span>' +
      '<span>' + S.tx({ yue: '共', zh: '共', en: '' }) + ' ' + total + ' ' + S.tx({ yue: '步', zh: '步', en: 'steps' }) + '</span>' +
      '<span>' + '⭐'.repeat(Math.min(5, t.stars)) + '</span>' +
      (doneN > 0 && !done ? '<span class="progress-pill">行咗 ' + doneN + '/' + total + ' 步</span>' : '') +
      '</span></span>' +
      (done ? '<span class="tc-done-badge">✔ ' + S.tx({ yue: '完成', zh: '完成', en: 'Done' }) + '</span>' : '') +
      '</button>'
    );
    node.addEventListener('click', function () {
      SP.speak(S.tx(t.title));
      S.go('/kid/run/' + t.id);
    });
    return node;
  }

  /* ==================== 一步一步 ==================== */
  function runScreen(params) {
    var t = ST.taskById(params.id);
    if (!t) return home();
    var st = ST.load();
    var prog = ST.taskProgress(t.id);
    var idx = 0;
    for (var i = 0; i < t.steps.length; i++) {
      if (!prog.steps[t.steps[i].id]) { idx = i; break; }
      if (i === t.steps.length - 1) idx = t.steps.length - 1;
    }
    if (prog.done) idx = t.steps.length - 1;

    var cur = idx;
    var v = S.el('<div class="view step-view"></div>');

    var top = S.el('<div style="display:flex;align-items:center;gap:8px;width:100%">' +
      '<button class="icon-btn small" id="k-exit" aria-label="離開">✕</button>' +
      '<div class="grow" style="font-weight:800;font-size:18px;text-align:center">' + S.tx(t.title) + '</div>' +
      '<button class="icon-btn small" id="k-undo" aria-label="上一步">↩</button>' +
      '</div>');
    v.appendChild(top);

    var dots = S.el('<div class="step-dots"></div>');
    v.appendChild(dots);

    var illu = S.el('<div class="step-illustration"></div>');
    var right = S.el('<div class="step-right" style="width:100%"></div>');
    var textBox = S.el('<div class="step-text"></div>');
    var actions = S.el('<div class="step-actions"></div>');
    right.appendChild(illu);
    right.appendChild(textBox);
    right.appendChild(actions);
    v.appendChild(right);

    var holdBtn, hb;

    function paint(animate) {
      var step = t.steps[cur];
      dots.innerHTML = t.steps.map(function (_, i) {
        var on = !!ST.taskProgress(t.id).steps[t.steps[i].id] || i < cur;
        return '<span class="dot ' + (on ? 'on' : '') + '"></span>';
      }).join('');

      var media = step.photo
        ? '<img class="photo" src="' + step.photo + '" alt="步驟相片">'
        : '<div class="big-emoji">' + step.icon + '</div>';
      illu.innerHTML = media;

      var txt = S.tx(step);
      textBox.innerHTML = txt.split('').map(function (ch, i) {
        return '<span class="w" style="animation-delay:' + (i * 45) + 'ms">' + S.esc(ch) + '</span>';
      }).join('');

      actions.innerHTML = '';
      var help = S.el('<button class="help-btn"><span style="font-size:28px">🙋</span><span>' +
        S.tx({ yue: '我唔識', zh: '我不会', en: 'Help' }) + '</span></button>');
      help.addEventListener('click', onHelp);
      actions.appendChild(help);

      holdBtn = S.el('<button class="hold-btn"><span class="fill"></span>' +
        '<span class="lbl">' + S.tx({ yue: '完成', zh: '完成', en: 'Done' }) + '</span>' +
        '<span class="sub">' + S.tx({ yue: '撳住 1 秒', zh: '按住 1 秒', en: 'Hold 1s' }) + '</span></button>');
      actions.appendChild(holdBtn);

      hb = S.holdToConfirm(holdBtn, {
        duration: 1000,
        onComplete: function () { onComplete(); },
        onCancel: function () { S.toast(S.tx({ yue: '撳住一秒先算完成呀', zh: '按住一秒才算完成哦', en: 'Hold for one second' })); }
      });

      // 朗讀掣
      var say = S.el('<button class="icon-btn" aria-label="朗讀">🔊</button>');
      say.addEventListener('click', function () { speakCurrent(true); });
      var sayWrap = S.el('<div class="row center" style="justify-content:center;margin-top:6px"></div>');
      sayWrap.appendChild(say);
      right.insertBefore(sayWrap, actions);
      actions.parentNode && actions.parentNode.appendChild(actions);

      if (st.settings.autoSpeak) setTimeout(function () { speakCurrent(false); }, 260);
    }

    function speakCurrent(force) {
      var step = t.steps[cur];
      textBox.classList.add('speaking');
      SP.speakStep(step, {
        onend: function () { textBox.classList.remove('speaking'); },
        lang: force ? S.lang() : S.lang()
      });
      setTimeout(function () { textBox.classList.remove('speaking'); }, 6000);
    }

    function onComplete() {
      var step = t.steps[cur];
      ST.completeStep(t.id, step.id);
      var lang = S.lang();
      var praise = {
        yue: ['做得好', '叻叻', '正呀', '好嘢', '繼續'],
        zh: ['做得好', '真棒', '太好了', '好样的', '继续'],
        en: ['Well done', 'Great job', 'Awesome', 'Nice work', 'Keep going']
      }[lang] || ['做得好'];
      SP.stop();
      SP.speak(praise[Math.floor(Math.random() * praise.length)], { lang: lang });
      if (cur < t.steps.length - 1) {
        cur++;
        paint(true);
      } else {
        ST.finishTask(t.id, 'kid');
        S.go('/kid/celebrate/' + t.id);
      }
    }

    function onHelp() {
      var step = t.steps[cur];
      ST.addHelp(step.id);
      SP.speak(S.tx({ yue: '我哋再試下呢一步啦', zh: '我们再试一下这一步吧', en: 'Let\'s try this step again' }));
      S.modal({
        title: S.tx({ yue: '需要幫手？', zh: '需要帮忙？', en: 'Need a hand?' }),
        body: '<p style="margin:0 0 10px">' + S.tx({ yue: '唔緊要，求助唔係失敗。', zh: '没关系，求助不是失败。', en: 'Asking for help is not failing.' }) + '</p>' +
          '<p class="muted small" style="margin:0">呢一步：' + S.esc(S.tx(step)) + '</p>',
        actions: [
          { label: S.tx({ yue: '再試一次', zh: '再试一次', en: 'Try again' }), cls: 'btn-primary' },
          {
            label: S.tx({ yue: '搵家長', zh: '找家长', en: 'Call parent' }), cls: 'btn-orange', onClick: function () {
              S.toast(S.tx({ yue: '已經記低啦，可以叫家長過嚟', zh: '已经记下了，可以叫家长过来', en: 'Noted — you can call a parent over' }));
            }
          },
          {
            label: S.tx({ yue: '呢步當完成', zh: '这步算完成', en: 'Mark as done' }), cls: 'btn-ghost', onClick: function () {
              ST.completeStep(t.id, step.id);
              if (cur < t.steps.length - 1) { cur++; paint(true); }
              else { ST.finishTask(t.id, 'kid'); S.go('/kid/celebrate/' + t.id); }
            }
          }
        ]
      });
    }

    top.querySelector('#k-exit').addEventListener('click', function () { SP.stop(); S.go('/kid/home'); });
    top.querySelector('#k-undo').addEventListener('click', function () {
      if (cur > 0) { ST.uncompleteStep(t.id, t.steps[cur - 1].id); cur--; paint(false); }
      else S.toast(S.tx({ yue: '已經係第一步', zh: '已经是第一步', en: 'This is the first step' }));
    });

    paint(false);

    var fab = S.voiceFab();
    fab.style.top = 'auto';
    fab.style.bottom = 'calc(96px + env(safe-area-inset-bottom,0px))';
    fab.style.right = '14px';
    v.appendChild(fab);
    return v;
  }

  /* ==================== 慶祝 ==================== */
  function celebrate(params) {
    var t = ST.taskById(params.id);
    var child = ST.activeChild();
    var st = ST.load();
    var v = S.el('<div class="view celebrate" style="padding-bottom:calc(40px + env(safe-area-inset-bottom,0px))"></div>');

    var stars = '';
    for (var i = 0; i < 5; i++) {
      stars += '<span class="s" style="left:' + (18 + i * 14) + '%;animation-delay:' + (i * 110) + 'ms">' +
        M.star(34, i % 2 ? '#F07A1F' : '#FFC85E') + '</span>';
    }

    v.innerHTML =
      '<div>' + M.gin({ scarf: (child || {}).scarf || '#1F9E94', anim: 'jump', mood: 'cheer', size: 210 }) + '</div>' +
      '<h2>' + S.tx({ yue: '你做到啦！', zh: '你做到啦！', en: 'You did it!' }) + '</h2>' +
      '<div class="sub">' + (t ? S.tx(t.title) : '') + '</div>' +
      '<div class="stars-fly">' + stars + '</div>' +
      '<div class="row" style="gap:8px;font-size:26px;font-weight:800;color:var(--orange)">' +
      M.star(30) + '<span>+' + (t ? t.stars : 1) + ' 粒星</span></div>' +
      '<div class="small muted">總共 ' + ST.totalStars((child || {}).id) + ' ⭐</div>';

    var btns = S.el('<div class="col mt24" style="width:min(360px,86vw)"></div>');
    var back = S.el('<button class="btn btn-primary btn-block">' + S.tx({ yue: '返去今日任務', zh: '回到今日任务', en: 'Back to today' }) + '</button>');
    back.addEventListener('click', function () { S.go('/kid/home'); });
    btns.appendChild(back);
    var play = S.el('<a class="btn btn-orange btn-block" href="#/kid/games">' + S.tx({ yue: '同 Gin 玩吓', zh: '和 Gin 玩一会', en: 'Play with Gin' }) + '</a>');
    btns.appendChild(play);
    v.appendChild(btns);

    var line = S.tx({ yue: '你完成咗所有步驟，真係好叻！', zh: '你完成了所有步骤，真的很棒！', en: 'You finished every step — well done!' });
    setTimeout(function () { SP.speak(line); }, 300);

    var timer = setTimeout(function () { if (location.hash.indexOf('/kid/celebrate/') === 0) S.go('/kid/home'); }, 6000);
    back.addEventListener('click', function () { clearTimeout(timer); });

    return v;
  }

  /* ==================== 星星罐 ==================== */
  function stars() {
    var child = ST.activeChild();
    var total = ST.totalStars((child || {}).id);
    var goal = 60;
    var fill = Math.min(1, (total % goal) / goal);
    var cycles = Math.floor(total / goal);

    var head = S.topbar({ title: S.tx({ yue: '星星罐', zh: '星星罐', en: 'Star Jar' }), back: function () { S.go('/kid/home'); } });
    var body = S.el('<div class="wrap center"></div>');

    body.appendChild(S.el('<div class="jar-box mt16">' + M.starJar(fill) + '</div>'));
    body.appendChild(S.el('<h2 style="font-size:36px;margin:16px 0 4px;font-weight:900">' + total + ' ⭐</h2>'));
    body.appendChild(S.el('<p class="muted">' +
      S.tx({ yue: '再儲 ' + Math.max(0, goal - (total % goal)) + ' 粒，Gin 就換新頸巾', zh: '再攒 ' + Math.max(0, goal - (total % goal)) + ' 颗，Gin 就换新围巾', en: (goal - (total % goal)) + ' more stars and Gin gets a new scarf' }) +
      '</p>'));

    // 星星流水
    var st = ST.load();
    var recent = st.starsLedger.filter(function (e) { return !child || !e.childId || e.childId === child.id; })
      .slice(-12).reverse();
    if (recent.length) {
      var list = S.el('<div class="card mt24" style="text-align:left"></div>');
      list.appendChild(S.el('<div style="font-weight:800;margin-bottom:10px">' + S.tx({ yue: '最近攞到嘅星', zh: '最近得到的星星', en: 'Recent stars' }) + '</div>'));
      recent.forEach(function (e) {
        list.appendChild(S.el('<div class="between" style="padding:9px 0;border-bottom:1px solid var(--line)">' +
          '<span>' + S.esc(e.reason) + '</span>' +
          '<span style="font-weight:800;color:var(--orange)">+' + e.delta + ' ⭐</span></div>'));
      });
      body.appendChild(list);
    }

    body.appendChild(S.el('<p class="small muted mt24">' +
      S.tx({ yue: '星星係「我做到」嘅記錄，唔係同人比較嘅分數。', zh: '星星是「我做到」的记录，不是和人比较的分数。', en: 'Stars are a record of what you did — not a score to compare.' }) +
      '</p>'));

    return view([head, body, S.tabbar('stars')]);
  }

  /* ==================== 成長地圖 ==================== */
  function mapScreen() {
    var child = ST.activeChild();
    var p = ST.mapProgress();
    var head = S.topbar({ title: S.tx({ yue: '我嘅地圖', zh: '我的地图', en: 'My Map' }), back: function () { S.go('/kid/home'); } });
    var body = S.el('<div class="wrap"></div>');

    body.appendChild(S.el('<div class="card center mt16">' +
      '<div style="font-size:20px;font-weight:800">' +
      S.tx({ yue: '完成 ' + p.doneCount + ' 個任務，解鎖咗 ' + p.unlocked + ' 個地方', zh: '完成 ' + p.doneCount + ' 个任务，解锁了 ' + p.unlocked + ' 个地方', en: p.doneCount + ' tasks done — ' + p.unlocked + ' places unlocked' }) +
      '</div>' +
      '<div class="small muted mt8">' +
      S.tx({ yue: '再完成 ' + p.remaining + ' 個任務，就去到下一個地方', zh: '再完成 ' + p.remaining + ' 个任务，就去到下一个地方', en: p.remaining + ' more tasks to reach the next place' }) +
      '</div>' +
      '</div>'));

    var scroller = S.el('<div class="card mt16"><div class="map-scroll">' + M.mapPath(p.unlocked) + '</div></div>');
    body.appendChild(scroller);

    body.appendChild(S.el('<p class="small muted center mt16">' +
      S.tx({ yue: '漏咗一日都唔會倒退，慢慢行。', zh: '漏了一天也不会倒退，慢慢走。', en: 'Missing a day never moves you backwards.' }) +
      '</p>'));

    return view([head, body, S.tabbar('map')]);
  }

  /* ==================== 圖鑑 ==================== */
  function book() {
    var all = ST.stickerBook();
    var head = S.topbar({ title: S.tx({ yue: '我完成過嘅任務', zh: '我完成过的任务', en: 'My Stickers' }), back: function () { S.go('/kid/home'); } });
    var body = S.el('<div class="wrap"></div>');
    var got = all.filter(function (a) { return a.unlocked; }).length;
    body.appendChild(S.el('<div class="card center mt16"><div style="font-size:22px;font-weight:800">' +
      got + ' / ' + all.length + '</div><div class="small muted">' +
      S.tx({ yue: '任務圖鑑', zh: '任务图鉴', en: 'Task collection' }) + '</div></div>'));

    var grid = S.el('<div class="sticker-grid mt16"></div>');
    all.forEach(function (a) {
      var n = S.el('<div class="sticker ' + (a.unlocked ? '' : 'locked') + '">' +
        '<span class="ic">' + a.task.icon + '</span>' +
        '<span class="nm">' + S.tx(a.task.title) + '</span></div>');
      if (a.unlocked) {
        n.addEventListener('click', function () { SP.speak(S.tx(a.task.title)); });
      }
      grid.appendChild(n);
    });
    body.appendChild(grid);

    return view([head, body]);
  }

  /* ==================== 註冊路由 ==================== */
  function register(route) {
    route('/kid/pick', pickChild);
    route('/kid/home', home);
    route('/kid/run/:id', runScreen);
    route('/kid/celebrate/:id', celebrate);
    route('/kid/stars', stars);
    route('/kid/map', mapScreen);
    route('/kid/book', book);
  }

  global.SBS_KID = {
    register: register,
    pickChild: pickChild,
    home: home
  };
})(window);
