/* ============================================================
   「一步一步」— 家長端（控制台）
   PIN 閘、首次設定、Dashboard、任務庫、任務編輯、
   時間表、週報告、設定與資料匯出
   ============================================================ */
(function (global) {
  'use strict';

  var S = global.SBS, ST = global.SBS_STORE, SP = global.SBS_SPEECH, M = global.SBS_MASCOT, D = global.SBS_DATA;

  function head(title, backHref) {
    return S.topbar({
      parent: true, title: title,
      back: backHref ? function () { S.go(backHref); } : null
    });
  }

  function wrap(nodes) {
    var v = S.el('<div class="view"></div>');
    (Array.isArray(nodes) ? nodes : [nodes]).forEach(function (n) { if (n) v.appendChild(n); });
    return v;
  }

  /* 簡單 PIN 雜湊（本地用途，唔係密碼學級別） */
  function hashPin(p) {
    var h = 5381;
    var s = 'sbs::' + p;
    for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
    return h.toString(36);
  }

  /* ==================== PIN 閘 ==================== */
  function parentGate(after) {
    var st = ST.load();
    if (!st.pin) return setPinFlow(after);

    var typed = '';
    var m = S.modal({
      title: '家長設定',
      body: '<p class="muted small" style="margin:0 0 6px">輸入 4 位 PIN 碼</p>' +
        '<div class="pin-display" id="pin-dots">' +
        '<span class="pin-dot"></span><span class="pin-dot"></span>' +
        '<span class="pin-dot"></span><span class="pin-dot"></span></div>' +
        '<div class="pin-pad">' + [1, 2, 3, 4, 5, 6, 7, 8, 9, '⌫', 0, '✓'].map(function (k) {
          return '<button class="pin-key" data-k="' + k + '">' + k + '</button>';
        }).join('') + '</div>',
      dismissible: true,
      actions: [{ label: '取消', cls: 'btn-ghost' }],
      onOpen: function (box, close) {
        var dots = box.querySelectorAll('.pin-dot');
        function paint() {
          dots.forEach(function (d, i) { d.classList.toggle('on', i < typed.length); d.classList.remove('err'); });
        }
        box.querySelectorAll('.pin-key').forEach(function (b) {
          b.addEventListener('click', function () {
            var k = b.dataset.k;
            if (k === '⌫') { typed = typed.slice(0, -1); paint(); return; }
            if (k === '✓') {
              if (hashPin(typed) === st.pin) {
                close();
                after ? after() : S.go('/parent/home');
              } else {
                typed = '';
                dots.forEach(function (d) { d.classList.add('err'); });
                if (navigator.vibrate) { try { navigator.vibrate(60); } catch (e) { } }
                setTimeout(paint, 500);
                S.toast('PIN 唔啱，再試一次');
              }
              return;
            }
            if (typed.length < 4) { typed += k; paint(); }
            if (typed.length === 4) {
              setTimeout(function () {
                if (hashPin(typed) === st.pin) { close(); after ? after() : S.go('/parent/home'); }
              }, 180);
            }
          });
        });
      }
    });
    return m;
  }

  function setPinFlow(after) {
    var first = '';
    S.modal({
      title: '設定家長 PIN',
      dismissible: false,
      body: '<p class="muted small" style="margin:0 0 6px">4 位數字，用嚟防止小朋友改亂設定</p>' +
        '<div class="pin-display" id="pin-dots">' +
        '<span class="pin-dot"></span><span class="pin-dot"></span>' +
        '<span class="pin-dot"></span><span class="pin-dot"></span></div>' +
        '<div class="pin-pad">' + [1, 2, 3, 4, 5, 6, 7, 8, 9, '⌫', 0, '✓'].map(function (k) {
          return '<button class="pin-key" data-k="' + k + '">' + k + '</button>';
        }).join('') + '</div>',
      onOpen: function (box, close) {
        var dots = box.querySelectorAll('.pin-dot');
        var typed = '';
        var stage = 1;
        function paint() { dots.forEach(function (d, i) { d.classList.toggle('on', i < typed.length); }); }
        function setLabel(t) { box.querySelector('.muted.small').textContent = t; }
        function submit() {
          if (typed.length < 4) return;
          if (stage === 1) { first = typed; typed = ''; stage = 2; paint(); setLabel('再輸入一次確認'); return; }
          if (typed === first) {
            var st = ST.load();
            st.pin = hashPin(typed);
            st.onboarded = true;
            ST.save();
            close();
            S.toast('PIN 設定好啦');
            after ? after() : S.go('/parent/home');
          } else { typed = ''; stage = 1; paint(); setLabel('兩次唔一樣，再嚟一次'); }
        }
        box.querySelectorAll('.pin-key').forEach(function (b) {
          b.addEventListener('click', function () {
            var k = b.dataset.k;
            if (k === '⌫') { typed = typed.slice(0, -1); paint(); return; }
            if (k === '✓') { submit(); return; }
            if (typed.length < 4) {
              typed += k; paint();
              if (typed.length === 4) setTimeout(submit, 220);
            }
          });
        });
      }
    });
  }

  /* ==================== 首次設定 ==================== */
  function onboarding() {
    var v = S.el('<div class="view" style="background:#fff"></div>');
    var body = S.el('<div class="wrap" style="max-width:560px;padding-top:24px"></div>');

    var step = 1;
    var child = { name: '', age: 7, avatar: '🐣', scarf: '#1F9E94' };

    function paint() {
      body.innerHTML = '';
      if (step === 1) {
        S.appendHTML(body,
          '<div class="center">' + M.gin({ size: 150, anim: 'wave', scarf: child.scarf }) + '</div>' +
          '<h1 style="font-size:30px;font-weight:900;margin:14px 0 6px">一步一步</h1>' +
          '<p class="muted">將「阿媽嗌到聲沙」嘅日常，變成小朋友自己睇得明、撳得到嘅步驟卡。</p>' +
          '<div class="p-card mt24"><b>點樣運作？</b>' +
          '<ul class="small muted" style="margin:10px 0 0;padding-left:20px;line-height:1.9">' +
          '<li>每個日常任務拆成 4–6 張卡，一張卡一件事</li>' +
          '<li>完成掣要長按 1 秒，防止誤撳跳步</li>' +
          '<li>有廣東話／普通話／英文語音，未識字都跟到</li>' +
          '<li>所有資料只儲喺呢部裝置，唔會上傳</li>' +
          '</ul></div>' +
          '<button class="btn btn-primary btn-block mt16" id="ob-go">開始設定</button>');
        body.querySelector('#ob-go').addEventListener('click', function () { step = 2; paint(); });
      } else if (step === 2) {
        S.appendHTML(body,
          '<h2 style="font-size:24px;font-weight:900">建立小朋友檔案</h2>' +
          '<p class="muted small">可以之後再加第二個小朋友。</p>' +
          '<div class="field mt16"><label>名</label><input type="text" id="ob-name" placeholder="例如：細佬" maxlength="12"></div>' +
          '<div class="field"><label>年齡</label><input type="number" id="ob-age" value="7" min="3" max="14"></div>' +
          '<div class="field"><label>揀個頭像</label><div class="chip-row" id="ob-ava"></div></div>' +
          '<div class="field"><label>揀 Gin 頸巾顏色（同小朋友一齊揀）</label><div class="chip-row" id="ob-scarf"></div></div>' +
          '<button class="btn btn-primary btn-block mt16" id="ob-next">下一步</button>');
        var ava = body.querySelector('#ob-ava');
        ST.AVATARS.forEach(function (a) {
          var c = S.el('<button class="chip ' + (child.avatar === a ? 'sel' : '') + '" style="font-size:24px">' + a + '</button>');
          c.addEventListener('click', function () { child.avatar = a; paint(); });
          ava.appendChild(c);
        });
        var sc = body.querySelector('#ob-scarf');
        ST.SCARVES.forEach(function (col) {
          var c = S.el('<button class="chip" style="background:' + col + ';width:44px;height:44px;border-radius:50%;padding:0"></button>');
          if (child.scarf === col) c.style.boxShadow = '0 0 0 4px rgba(43,43,43,.25)';
          c.addEventListener('click', function () { child.scarf = col; paint(); });
          sc.appendChild(c);
        });
        var nm = body.querySelector('#ob-name'); nm.value = child.name;
        nm.addEventListener('input', function () { child.name = nm.value; });
        var ag = body.querySelector('#ob-age'); ag.value = child.age;
        ag.addEventListener('input', function () { child.age = +ag.value || 7; });
        body.querySelector('#ob-next').addEventListener('click', function () {
          if (!child.name.trim()) { S.toast('填個名先'); return; }
          step = 3; paint();
        });
      } else if (step === 3) {
        var st = ST.load();
        S.appendHTML(body,
          '<h2 style="font-size:24px;font-weight:900">開邊啲任務？</h2>' +
          '<p class="muted small">第一週建議只開「朝早」兩個，順咗先加其餘。全部都可以之後改。</p>' +
          '<div class="p-card mt16" id="ob-tasks"></div>' +
          '<button class="btn btn-primary btn-block mt16" id="ob-finish">設定 PIN 並完成</button>');
        var box = body.querySelector('#ob-tasks');
        st.tasks.forEach(function (t) {
          var row = S.el('<div class="task-row ' + (t.enabled ? '' : 'off') + '">' +
            '<span class="tr-icon">' + t.icon + '</span>' +
            '<span class="grow"><span class="tr-name">' + S.tx(t.title) + '</span>' +
            '<span class="tr-meta">' + S.tx({ yue: D.CATEGORIES.find(function (c) { return c.id === t.cat; }).name }) +
            ' · ' + t.steps.length + ' 步 · ' + t.minutes + ' 分鐘</span></span>' +
            '<span class="switch ' + (t.enabled ? 'on' : '') + '"></span></div>');
          row.addEventListener('click', function () {
            t.enabled = !t.enabled;
            st.schedule[t.id] = st.schedule[t.id] || { days: t.days.slice(), slot: t.slot };
            ST.save(); paint();
          });
          box.appendChild(row);
        });
        body.querySelector('#ob-finish').addEventListener('click', function () {
          ST.addChild(child.name.trim(), child.age, child.avatar, child.scarf);
          setPinFlow(function () { S.go('/parent/home'); });
        });
      }
    }

    paint();
    v.appendChild(head(' '));
    v.appendChild(body);
    return v;
  }

  /* ==================== 家長 Dashboard ==================== */
  function dashboard() {
    var st = ST.load();
    if (!st.onboarded || !st.children.length) return onboarding();

    var rep = ST.weekReport();
    var today = rep.days[rep.days.length - 1];
    var tasks = ST.todayTasks(st.activeChildId);
    var key = ST.todayKey();
    var rec = st.completions[key] || {};
    var doneToday = tasks.filter(function (t) { return rec[t.id] && rec[t.id].done; }).length;

    var body = S.el('<div class="wrap" style="max-width:720px"></div>');

    body.appendChild(S.el(
      '<div class="kpi-grid mt8">' +
      '<div class="kpi"><div class="v">' + doneToday + '/' + tasks.length + '</div><div class="l">今日完成</div></div>' +
      '<div class="kpi"><div class="v">' + Math.round(rep.rate * 100) + '%</div><div class="l">本週完成率</div></div>' +
      '<div class="kpi"><div class="v">' + ST.totalStars(st.activeChildId) + '</div><div class="l">累積星星</div></div>' +
      '<div class="kpi"><div class="v">' + streak() + '</div><div class="l">連續有完成（日）</div></div>' +
      '</div>'
    ));

    // 今日
    body.appendChild(S.el('<div class="p-section-title">今日任務</div>'));
    var todayCard = S.el('<div class="p-card" style="padding:6px 4px"></div>');
    if (!tasks.length) {
      todayCard.appendChild(S.el('<div class="task-row"><span class="grow muted small">今日時間表未排任務，去「任務庫」開啟。</span></div>'));
    }
    tasks.forEach(function (t) {
      var r = rec[t.id] || { steps: {}, done: false };
      var n = Object.keys(r.steps || {}).length;
      var row = S.el('<div class="task-row">' +
        '<span class="tr-icon">' + t.icon + '</span>' +
        '<span class="grow"><span class="tr-name">' + S.tx(t.title) + '</span>' +
        '<span class="tr-meta">' + n + '/' + t.steps.length + ' 步 · ' +
        (r.done ? (r.by === 'parent' ? '家長補完成' : '小朋友完成') : '未完成') + '</span></span>' +
        (r.done
          ? '<button class="btn btn-sm btn-ghost" data-act="reset">撤銷</button>'
          : '<button class="btn btn-sm btn-soft" data-act="done">補完成</button>') +
        '</div>');
      row.querySelector('button').addEventListener('click', function () {
        if (r.done) { ST.resetTask(t.id); S.toast('已撤銷'); }
        else { ST.parentCompleteTask(t.id); S.toast('已幫 ' + S.tx(t.title) + ' 補完成'); }
        S.render();
      });
      todayCard.appendChild(row);
    });
    body.appendChild(todayCard);

    // 卡點
    if (rep.stuck.length) {
      body.appendChild(S.el('<div class="p-section-title">' + S.tx({ yue: '邊步最常卡住？', zh: '哪一步最常卡住？', en: 'Where do they get stuck?' }) + '</div>'));
      var sc = S.el('<div class="p-card"></div>');
      rep.stuck.forEach(function (s) {
        sc.appendChild(S.el('<div class="task-row">' +
          '<span class="grow"><span class="tr-name" style="font-size:15px">' + S.esc(s.text) + '</span>' +
          '<span class="tr-meta">' + s.taskTitle + '</span></span>' +
          '<span class="chip">' + s.count + ' 次求助</span></div>'));
      });
      sc.appendChild(S.el('<div class="small muted" style="padding:10px 4px 2px">' +
        S.tx({ yue: '同一步成日卡住，通常係拆得未夠細，可以拆做兩步。', zh: '同一步总是卡住，通常是拆得不够细，可以拆成两步。', en: 'A step that keeps sticking is usually too big — split it in two.' }) + '</div>'));
      body.appendChild(sc);
    }

    // 快捷
    body.appendChild(S.el('<div class="p-section-title">管理</div>'));
    var links = S.el('<div class="p-card" style="padding:6px 4px"></div>');
    [
      { href: '/parent/tasks', icon: '📚', t: '任務庫', d: '開關任務、改步驟、加自訂任務' },
      { href: '/parent/schedule', icon: '🗓️', t: '時間表', d: '設定邊日幾時出現邊個任務' },
      { href: '/parent/report', icon: '📊', t: '週報告', d: '完成率走勢、卡點分析' },
      { href: '/parent/understand', icon: '🧠', t: '理解孩子', d: '執行功能與前額葉發展 · 家長閱讀' },
      { href: '/parent/settings', icon: '⚙️', t: '設定', d: '語音、PIN、小朋友檔案、備份' }
    ].forEach(function (l) {
      var row = S.el('<a class="task-row" href="#' + l.href + '" style="text-decoration:none;color:inherit">' +
        '<span class="tr-icon">' + l.icon + '</span>' +
        '<span class="grow"><span class="tr-name">' + S.tx({ yue: l.t, zh: l.t, en: l.t }) + '</span>' +
        '<span class="tr-meta">' + S.tx({ yue: l.d, zh: l.d, en: l.d }) + '</span></span><span>›</span></div></a>');
      links.appendChild(row);
    });
    body.appendChild(links);

    // 提醒
    body.appendChild(S.el('<div class="p-card mt16" style="background:#FFF6E9">' +
      '<div style="font-weight:800;font-size:15px">💡 ' + S.tx({ yue: '今日唔使滿分', zh: '今天不用满分', en: 'No perfect score needed' }) + '</div>' +
      '<div class="small muted mt8" style="line-height:1.7">' +
      S.tx({ yue: '行到邊步都值得講一句：「我見到你完成咗邊步。」完成率唔係 KPI。', zh: '走到哪一步都值得说一句：「我看到你完成了哪一步。」完成率不是 KPI。', en: 'Say: "I saw which steps you finished." Completion rate is not a KPI.' }) +
      '</div></div>'));

    var giveBack = S.el('<button class="btn btn-primary btn-block mt16">畀小朋友用</button>');
    giveBack.addEventListener('click', function () { SP.stop(); S.go('/kid/home'); });
    body.appendChild(giveBack);

    var v = wrap([head('家長控制台'), body]);
    var fab = S.voiceFab();
    v.appendChild(fab);
    return v;
  }

  function streak() {
    var st = ST.load();
    var n = 0;
    for (var i = 0; i < 60; i++) {
      var key = ST.dateKeyOffset(-i);
      var rec = st.completions[key] || {};
      var any = Object.keys(rec).some(function (k) { return rec[k].done; });
      if (any) n++;
      else if (i > 0) break;
      else if (!any) break;
    }
    return n;
  }

  /* ==================== 任務庫 ==================== */
  function taskLibrary() {
    var st = ST.load();
    var body = S.el('<div class="wrap" style="max-width:720px"></div>');

    body.appendChild(S.el('<div class="p-card mt8 small muted">' +
      S.tx({ yue: '關閉咗嘅任務唔會喺「今日任務」出現。改動建議今晚先改，聽朝先出現，畀小朋友覺得啲卡係穩定嘅。', zh: '关闭的任务不会出现在「今日任务」。建议今晚改，明早才出现，让孩子觉得卡片是稳定的。', en: 'Disabled tasks stay hidden. Change them tonight so tomorrow feels stable.' }) +
      '</div>'));

    var card = S.el('<div class="p-card" style="padding:6px 4px"></div>');
    st.tasks.forEach(function (t) {
      var row = S.el('<div class="task-row ' + (t.enabled ? '' : 'off') + '">' +
        '<span class="tr-icon">' + t.icon + '</span>' +
        '<span class="grow"><span class="tr-name">' + S.tx(t.title) +
        (t.custom ? ' <span class="chip" style="font-size:11px;padding:2px 8px">自訂</span>' : '') + '</span>' +
        '<span class="tr-meta">' + catName(t.cat) + ' · ' + t.steps.length + ' 步 · ' + t.minutes + ' 分鐘 · ' + t.stars + '⭐</span></span>' +
        '<a class="btn btn-sm btn-ghost" href="#/parent/edit/' + t.id + '">改</a>' +
        '<span class="switch ' + (t.enabled ? 'on' : '') + '"></span></div>');
      row.querySelector('.switch').addEventListener('click', function (e) {
        e.stopPropagation();
        t.enabled = !t.enabled;
        ST.save();
        S.render();
      });
      card.appendChild(row);
    });
    body.appendChild(card);

    var add = S.el('<button class="btn btn-primary btn-block mt16">＋ 新增自訂任務</button>');
    add.addEventListener('click', function () { newTask(); });
    body.appendChild(add);

    var back = S.el('<a class="btn btn-ghost btn-block mt8" href="#/parent/home">返控制台</a>');
    body.appendChild(back);

    return wrap([head('任務庫', '/parent/home'), body]);
  }

  function catName(id) {
    var c = D.CATEGORIES.find(function (x) { return x.id === id; });
    return c ? S.tx(c.name) : id;
  }

  function newTask() {
    S.modal({
      title: '新增自訂任務',
      body: '<div class="field"><label>任務名（廣東話）</label><input type="text" id="nt-yue" placeholder="例如：執書包"></div>' +
        '<div class="field"><label>任務名（書面語／普通話）</label><input type="text" id="nt-zh"></div>' +
        '<div class="field"><label>Task name (English)</label><input type="text" id="nt-en"></div>' +
        '<div class="field"><label>圖示（emoji）</label><input type="text" id="nt-icon" value="⭐" maxlength="4"></div>' +
        '<div class="field"><label>建議分鐘</label><input type="number" id="nt-min" value="5" min="1" max="60"></div>' +
        '<div class="field"><label>星星</label><input type="number" id="nt-star" value="3" min="1" max="5"></div>',
      actions: [
        { label: '取消', cls: 'btn-ghost' },
        {
          label: '建立', cls: 'btn-primary', onClick: function (box) {
            var yue = box.querySelector('#nt-yue').value.trim();
            if (!yue) { S.toast('要填任務名'); return; }
            var st = ST.load();
            var t = {
              id: ST.uid('task'),
              icon: box.querySelector('#nt-icon').value.trim() || '⭐',
              cat: 'home',
              slot: 'evening',
              minutes: +box.querySelector('#nt-min').value || 5,
              stars: +box.querySelector('#nt-star').value || 3,
              days: [0, 1, 2, 3, 4, 5, 6],
              enabled: true,
              custom: true,
              title: {
                yue: yue,
                zh: box.querySelector('#nt-zh').value.trim() || yue,
                en: box.querySelector('#nt-en').value.trim() || yue
              },
              steps: [{
                id: ST.uid('step'), yue: '第一步', zh: '第一步', en: 'First step', icon: '1️⃣', photo: null
              }]
            };
            st.tasks.push(t);
            st.schedule[t.id] = { days: t.days.slice(), slot: t.slot };
            ST.save();
            S.go('/parent/edit/' + t.id);
          }
        }
      ]
    });
  }

  /* ==================== 任務編輯 ==================== */
  function taskEdit(params) {
    var st = ST.load();
    var t = ST.taskById(params.id);
    if (!t) return taskLibrary();

    var body = S.el('<div class="wrap" style="max-width:720px"></div>');

    body.appendChild(S.el('<div class="p-section-title">基本資料</div>'));
    var base = S.el('<div class="p-card"></div>');
    base.innerHTML =
      '<div class="field"><label>任務名（廣東話）</label><input type="text" data-f="yue" value="' + S.esc(t.title.yue) + '"></div>' +
      '<div class="field"><label>任務名（書面語／普通話）</label><input type="text" data-f="zh" value="' + S.esc(t.title.zh) + '"></div>' +
      '<div class="field"><label>Task name (English)</label><input type="text" data-f="en" value="' + S.esc(t.title.en) + '"></div>' +
      '<div class="field"><label>圖示 emoji</label><input type="text" data-f="icon" value="' + S.esc(t.icon) + '" maxlength="4" style="font-size:24px"></div>' +
      '<div class="row-wrap">' +
      '<div class="field grow"><label>分鐘</label><input type="number" data-f="minutes" value="' + t.minutes + '" min="1" max="60"></div>' +
      '<div class="field grow"><label>星星</label><input type="number" data-f="stars" value="' + t.stars + '" min="1" max="5"></div>' +
      '<div class="field grow"><label>分類</label><select data-f="cat">' +
      D.CATEGORIES.map(function (c) { return '<option value="' + c.id + '"' + (c.id === t.cat ? ' selected' : '') + '>' + S.tx(c.name) + '</option>'; }).join('') +
      '</select></div></div>';
    base.querySelectorAll('input,select').forEach(function (inp) {
      inp.addEventListener('input', function () {
        var f = inp.dataset.f;
        if (f === 'minutes' || f === 'stars') t[f] = +inp.value || 1;
        else t[f] = inp.value;
        ST.saveSoon();
      });
    });
    body.appendChild(base);

    // 步驟
    body.appendChild(S.el('<div class="p-section-title">步驟（' + t.steps.length + '）</div>'));
    var stepsBox = S.el('<div class="p-card"></div>');
    body.appendChild(stepsBox);

    function paintSteps() {
      stepsBox.innerHTML = '';
      t.steps.forEach(function (s, i) {
        var row = S.el('<div class="step-edit">' +
          '<span class="se-no">' + (i + 1) + '</span>' +
          (s.photo
            ? '<img class="se-photo" src="' + s.photo + '">'
            : '<button class="se-ic" title="改圖示">' + s.icon + '</button>') +
          '<span class="se-body">' +
          '<input data-s="' + i + '" data-k="yue" value="' + S.esc(s.yue) + '" placeholder="廣東話（小朋友會聽到）">' +
          '<input data-s="' + i + '" data-k="zh" value="' + S.esc(s.zh) + '" placeholder="書面語（普通話朗讀）">' +
          '<input data-s="' + i + '" data-k="en" value="' + S.esc(s.en) + '" placeholder="English">' +
          '</span>' +
          '<span class="col" style="gap:4px">' +
          '<button class="btn btn-sm btn-ghost" data-up="' + i + '" style="min-height:40px;padding:4px 10px">↑</button>' +
          '<button class="btn btn-sm btn-ghost" data-dn="' + i + '" style="min-height:40px;padding:4px 10px">↓</button>' +
          '<button class="btn btn-sm btn-ghost" data-rm="' + i + '" style="min-height:40px;padding:4px 10px">✕</button>' +
          '</span></div>');

        row.querySelectorAll('input').forEach(function (inp) {
          inp.addEventListener('input', function () {
            s[inp.dataset.k] = inp.value;
            ST.saveSoon();
          });
        });
        var ic = row.querySelector('.se-ic');
        if (ic) ic.addEventListener('click', function () { pickIcon(s); });
        var ph = row.querySelector('.se-photo');
        if (ph) ph.addEventListener('click', function () { photoMenu(s); });

        var up = row.querySelector('[data-up]');
        up.addEventListener('click', function () {
          if (i > 0) { var tmp = t.steps[i - 1]; t.steps[i - 1] = t.steps[i]; t.steps[i] = tmp; ST.save(); paintSteps(); }
        });
        var dn = row.querySelector('[data-dn]');
        dn.addEventListener('click', function () {
          if (i < t.steps.length - 1) { var tmp = t.steps[i + 1]; t.steps[i + 1] = t.steps[i]; t.steps[i] = tmp; ST.save(); paintSteps(); }
        });
        var rm = row.querySelector('[data-rm]');
        rm.addEventListener('click', function () {
          S.confirmBox('刪咗呢一步？', '「' + S.esc(s.yue) + '」會被移除。', function () {
            t.steps.splice(i, 1); ST.save(); paintSteps();
          }, '刪除');
        });
        stepsBox.appendChild(row);
      });

      var addRow = S.el('<div class="row-wrap mt8">' +
        '<button class="btn btn-sm btn-soft" id="add-step">＋ 加一步</button>' +
        '<button class="btn btn-sm btn-ghost" id="add-photo">📷 用相片做卡圖</button>' +
        '<button class="btn btn-sm btn-ghost" id="preview">👀 預覽小朋友視角</button>' +
        '</div>');
      addRow.querySelector('#add-step').addEventListener('click', function () {
        t.steps.push({ id: ST.uid('step'), yue: '新步驟', zh: '新步骤', en: 'New step', icon: '⭐', photo: null });
        ST.save(); paintSteps();
      });
      addRow.querySelector('#add-photo').addEventListener('click', function () {
        var s = { id: ST.uid('step'), yue: t.title.yue, zh: t.title.zh, en: t.title.en, icon: t.icon, photo: null };
        pickPhoto(function (dataUrl) {
          s.photo = dataUrl;
          t.steps.push(s);
          ST.save(); paintSteps();
        });
      });
      addRow.querySelector('#preview').addEventListener('click', function () {
        ST.save();
        S.go('/kid/run/' + t.id);
      });
      stepsBox.appendChild(addRow);
    }

    function pickIcon(s) {
      var presets = ['⏰', '🚽', '🪥', '🪞', '👕', '🥛', '🍚', '🥣', '🍽️', '🧻',
        '🎒', '📚', '📖', '✏️', '📝', '📄', '🚪', '💧', '💳', '😷', '👟',
        '🧹', '🧽', '🗑️', '🧺', '🛁', '🚿', '🧴', '🫧', '🧦', '🗄️',
        '🧸', '📦', '🛏️', '🛌', '🌙', '💡', '🐱', '🐾', '🤺', '🥅',
        '🙋', '🙌', '✋', '🧼', '🚰', '✨', '☑️', '🔍', '⏱️', '🗣️'];
      S.modal({
        title: '揀個圖示',
        body: '<div class="chip-row" style="font-size:26px;gap:10px">' +
          presets.map(function (e) { return '<button class="chip" data-e="' + e + '" style="font-size:26px;min-width:52px">' + e + '</button>'; }).join('') +
          '</div>' +
          '<div class="field mt16"><label>或者直接輸入 emoji</label><input type="text" id="ic-in" value="' + S.esc(s.icon) + '"></div>',
        actions: [
          { label: '取消', cls: 'btn-ghost' },
          {
            label: '用呢個', cls: 'btn-primary', onClick: function (box) {
              var v = box.querySelector('#ic-in').value.trim();
              s.icon = v || s.icon;
              ST.save(); paintSteps();
            }
          }
        ],
        onOpen: function (box) {
          box.querySelectorAll('[data-e]').forEach(function (b) {
            b.addEventListener('click', function () {
              s.icon = b.dataset.e; ST.save();
              box.querySelector('#ic-in').value = s.icon;
            });
          });
        }
      });
    }

    function photoMenu(s) {
      S.modal({
        title: '卡圖',
        body: '<p class="muted small">小朋友認自己屋企嘅相最有效，例如自己書包張相。</p>',
        actions: [
          { label: '取消', cls: 'btn-ghost' },
          {
            label: '換相片', cls: 'btn-primary', onClick: function () {
              pickPhoto(function (d) { s.photo = d; ST.save(); paintSteps(); });
            }
          },
          {
            label: '用 emoji', cls: 'btn-soft', onClick: function () {
              s.photo = null; ST.save(); paintSteps();
            }
          }
        ]
      });
    }

    paintSteps();

    var foot = S.el('<div class="col mt24"></div>');
    var backBtn = S.el('<a class="btn btn-primary btn-block" href="#/parent/tasks">完成，返任務庫</a>');
    foot.appendChild(backBtn);
    if (t.custom) {
      var del = S.el('<button class="btn btn-danger btn-block">刪除呢個自訂任務</button>');
      del.addEventListener('click', function () {
        S.confirmBox('刪除任務？', '「' + S.esc(t.title.yue) + '」會永久刪除。', function () {
          var s2 = ST.load();
          s2.tasks = s2.tasks.filter(function (x) { return x.id !== t.id; });
          delete s2.schedule[t.id];
          ST.save();
          S.go('/parent/tasks');
        }, '刪除');
      });
      foot.appendChild(del);
    }
    body.appendChild(foot);

    return wrap([head('改任務', '/parent/tasks'), body]);
  }

  /* 相片上傳（壓縮後存 dataURL，避免塞爆 localStorage） */
  function pickPhoto(cb) {
    var inp = document.createElement('input');
    inp.type = 'file';
    inp.accept = 'image/*';
    inp.addEventListener('change', function () {
      var f = inp.files && inp.files[0];
      if (!f) return;
      var fr = new FileReader();
      fr.onload = function () {
        var img = new Image();
        img.onload = function () {
          var max = 640;
          var w = img.width, h = img.height;
          var scale = Math.min(1, max / Math.max(w, h));
          var c = document.createElement('canvas');
          c.width = Math.round(w * scale); c.height = Math.round(h * scale);
          c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
          try {
            cb(c.toDataURL('image/jpeg', 0.72));
            S.toast('相片已加入');
          } catch (e) { S.toast('相片處理失敗'); }
        };
        img.onerror = function () { S.toast('讀唔到張相'); };
        img.src = fr.result;
      };
      fr.readAsDataURL(f);
    });
    inp.click();
  }

  /* ==================== 時間表 ==================== */
  function schedule() {
    var st = ST.load();
    var body = S.el('<div class="wrap" style="max-width:720px"></div>');

    body.appendChild(S.el('<div class="p-card mt8 small muted">' +
      S.tx({ yue: '揀邊日出現，再揀時段。同一個任務可以喺唔同日出現。', zh: '选择哪一天出现，再选时段。同一个任务可以在不同日子出现。', en: 'Pick the days and the time slot for each task.' }) +
      '</div>'));

    st.tasks.filter(function (t) { return t.enabled; }).forEach(function (t) {
      var sc = st.schedule[t.id] || (st.schedule[t.id] = { days: t.days.slice(), slot: t.slot });
      var card = S.el('<div class="p-card"></div>');
      card.appendChild(S.el('<div class="task-row" style="border:none;padding-bottom:4px">' +
        '<span class="tr-icon">' + t.icon + '</span>' +
        '<span class="grow"><span class="tr-name">' + S.tx(t.title) + '</span></span></div>'));

      var days = S.el('<div class="chip-row" style="padding:0 14px 10px"></div>');
      D.WEEKDAYS.forEach(function (w) {
        var on = sc.days.indexOf(w.id) !== -1;
        var c = S.el('<button class="chip ' + (on ? 'on' : '') + '">' + S.tx(w.name) + '</button>');
        c.addEventListener('click', function () {
          var i = sc.days.indexOf(w.id);
          if (i === -1) sc.days.push(w.id); else sc.days.splice(i, 1);
          ST.save(); S.render();
        });
        days.appendChild(c);
      });
      card.appendChild(days);

      var slots = S.el('<div class="chip-row" style="padding:0 14px 12px"></div>');
      D.SLOTS.forEach(function (sl) {
        var on = sc.slot === sl.id;
        var c = S.el('<button class="chip ' + (on ? 'sel' : '') + '">' + sl.icon + ' ' + S.tx(sl.name) + '</button>');
        c.addEventListener('click', function () { sc.slot = sl.id; t.slot = sl.id; ST.save(); S.render(); });
        slots.appendChild(c);
      });
      card.appendChild(slots);
      body.appendChild(card);
    });

    var back = S.el('<a class="btn btn-primary btn-block mt16" href="#/parent/home">完成，返控制台</a>');
    body.appendChild(back);

    return wrap([head('時間表', '/parent/home'), body]);
  }

  /* ==================== 週報告 ==================== */
  function report() {
    var st = ST.load();
    var rep = ST.weekReport();
    var body = S.el('<div class="wrap" style="max-width:720px"></div>');

    body.appendChild(S.el('<div class="p-card mt8">' +
      '<div class="between"><div><div class="p-title">本週完成率</div>' +
      '<div class="p-sub">' + rep.totalDone + ' / ' + rep.totalScheduled + ' 個任務</div></div>' +
      '<div style="font-size:38px;font-weight:900;color:var(--mint-dark)">' + Math.round(rep.rate * 100) + '%</div></div>' +
      '<div class="bar-chart mt16">' +
      rep.days.map(function (d) {
        var pct = Math.round(d.rate * 100);
        return '<div class="bar-col"><span class="pc">' + pct + '%</span>' +
          '<div class="bar ' + (d.rate ? '' : 'zero') + '" style="height:' + Math.max(6, d.rate * 100) + '%"></div>' +
          '<span class="lb">' + S.tx(D.WEEKDAYS[d.dow].short) + '</span></div>';
      }).join('') +
      '</div></div>'));

    if (rep.missed.length) {
      body.appendChild(S.el('<div class="p-section-title">最常未完成嘅任務</div>'));
      var m = S.el('<div class="p-card" style="padding:6px 4px"></div>');
      rep.missed.forEach(function (x) {
        m.appendChild(S.el('<div class="task-row">' +
          '<span class="tr-icon">' + x.icon + '</span>' +
          '<span class="grow"><span class="tr-name">' + S.esc(x.title) + '</span></span>' +
          '<span class="chip">本週 ' + x.count + ' 日未完成</span></div>'));
      });
      body.appendChild(m);
    }

    if (rep.stuck.length) {
      body.appendChild(S.el('<div class="p-section-title">最常求助（卡住）嘅步驟</div>'));
      var s2 = S.el('<div class="p-card" style="padding:6px 4px"></div>');
      rep.stuck.forEach(function (x) {
        s2.appendChild(S.el('<div class="task-row">' +
          '<span class="grow"><span class="tr-name" style="font-size:15px">' + S.esc(x.text) + '</span>' +
          '<span class="tr-meta">' + S.esc(x.taskTitle) + '</span></span>' +
          '<span class="chip">' + x.count + ' 次</span></div>'));
      });
      body.appendChild(s2);
    }

    body.appendChild(S.el('<div class="p-card mt16" style="background:#F2F8F7">' +
      '<div style="font-weight:800">🧠 EF 小提示</div>' +
      '<div class="small muted mt8" style="line-height:1.75">' +
      S.tx({
        yue: '前額葉未成熟唔係「唔聽話」，而係同時記住多步指令超出工作記憶容量。與其重複嗌，不如將工作記憶外包畀介面。',
        zh: '前额叶未成熟不是「不听话」，而是同时记住多步指令超出工作记忆容量。与其反复催促，不如把工作记忆外包给界面。',
        en: 'An undeveloped prefrontal cortex is not defiance — holding many steps at once simply exceeds working memory. Offload it to the interface instead of repeating.'
      }) +
      '</div></div>'));

    var printBtn = S.el('<button class="btn btn-ghost btn-block mt16">🖨️ 列印／存成 PDF</button>');
    printBtn.addEventListener('click', function () { window.print(); });
    body.appendChild(printBtn);
    var back = S.el('<a class="btn btn-primary btn-block mt8" href="#/parent/home">返控制台</a>');
    body.appendChild(back);

    return wrap([head('週報告', '/parent/home'), body]);
  }

  /* ==================== 設定 ==================== */
  function settings() {
    var st = ST.load();
    var body = S.el('<div class="wrap" style="max-width:720px"></div>');

    // 語音
    body.appendChild(S.el('<div class="p-section-title">語音朗讀</div>'));
    var vc = S.el('<div class="p-card"></div>');
    var status = SP.voiceStatus();
    vc.innerHTML = '<div class="field"><label>預設朗讀語言</label><div class="chip-row" id="v-lang">' +
      Object.keys(SP.LANGS).map(function (k) {
        var L = SP.LANGS[k];
        var ok = status[k].available;
        return '<button class="chip ' + (st.settings.voice === k ? 'sel' : '') + '" data-v="' + k + '">' +
          L.flag + ' ' + L.label + (ok ? '' : ' ⚠') + '</button>';
      }).join('') + '</div></div>' +
      '<div class="field"><label>語速：<b id="v-rate-v">' + st.settings.rate + '</b>×</label>' +
      '<input type="range" id="v-rate" min="0.6" max="1.3" step="0.05" value="' + st.settings.rate + '" style="width:100%"></div>' +
      '<div class="row-wrap"><button class="btn btn-sm btn-soft" id="v-test">🔊 試聽</button>' +
      '<button class="btn btn-sm btn-ghost" id="v-diag">檢查語音支援</button></div>';
    vc.querySelectorAll('[data-v]').forEach(function (b) {
      b.addEventListener('click', function () {
        st.settings.voice = b.dataset.v; ST.save(); S.render();
        SP.speak(SP.LANGS[b.dataset.v].label, { lang: b.dataset.v });
      });
    });
    vc.querySelector('#v-rate').addEventListener('input', function () {
      st.settings.rate = +this.value;
      vc.querySelector('#v-rate-v').textContent = this.value;
      ST.saveSoon();
    });
    vc.querySelector('#v-test').addEventListener('click', function () {
      SP.speak(S.tx({ yue: '一步一步，我陪住你', zh: '一步一步，我陪着你', en: 'Step by step, I am with you' }));
    });
    vc.querySelector('#v-diag').addEventListener('click', function () {
      var s2 = SP.voiceStatus();
      S.modal({
        title: '語音支援檢查',
        body: '<div class="small" style="line-height:2">' +
          Object.keys(s2).map(function (k) {
            var L = SP.LANGS[k];
            return '<div><b>' + L.flag + ' ' + L.label + '（' + L.code + '）</b>：' +
              (s2[k].available ? '✅ ' + S.esc(s2[k].voiceName) : '⚠️ 系統冇呢個語言嘅聲音，會用預設聲音代替') + '</div>';
          }).join('') +
          '<div class="muted mt16">提示：iOS／macOS Safari 內置廣東話聲音較完整；Windows Chrome 可到「設定 → 語言」加裝語音包。</div>' +
          '</div>',
        actions: [{ label: '知道啦', cls: 'btn-primary' }]
      });
    });
    body.appendChild(vc);

    // 小朋友介面
    body.appendChild(S.el('<div class="p-section-title">小朋友介面</div>'));
    var ui = S.el('<div class="p-card"></div>');
    ui.innerHTML =
      '<div class="task-row"><span class="grow"><span class="tr-name">大字模式</span>' +
      '<span class="tr-meta">適合視力或感官需要嘅小朋友</span></span>' +
      '<span class="switch ' + (st.settings.bigText ? 'on' : '') + '" data-s="bigText"></span></div>' +
      '<div class="task-row"><span class="grow"><span class="tr-name">減少動畫</span>' +
      '<span class="tr-meta">慶祝與過場改為靜態</span></span>' +
      '<span class="switch ' + (st.settings.reduceMotion ? 'on' : '') + '" data-s="reduceMotion"></span></div>' +
      '<div class="task-row"><span class="grow"><span class="tr-name">自動朗讀每一步</span>' +
      '<span class="tr-meta">進入新步驟自動讀一次</span></span>' +
      '<span class="switch ' + (st.settings.autoSpeak ? 'on' : '') + '" data-s="autoSpeak"></span></div>';
    ui.querySelectorAll('[data-s]').forEach(function (sw) {
      sw.addEventListener('click', function () {
        var k = sw.dataset.s;
        st.settings[k] = !st.settings[k];
        ST.save(); S.applySettings(); S.render();
      });
    });
    body.appendChild(ui);

    // 小朋友檔案
    body.appendChild(S.el('<div class="p-section-title">小朋友檔案</div>'));
    var kids = S.el('<div class="p-card" style="padding:6px 4px"></div>');
    st.children.forEach(function (c) {
      var row = S.el('<div class="task-row">' +
        '<span class="tr-icon" style="font-size:30px">' + c.avatar + '</span>' +
        '<span class="grow"><span class="tr-name">' + S.esc(c.name) + (c.id === st.activeChildId ? ' <span class="chip" style="font-size:11px;padding:2px 8px">現用</span>' : '') + '</span>' +
        '<span class="tr-meta">' + (c.age || '—') + ' 歲 · ' + ST.totalStars(c.id) + ' ⭐</span></span>' +
        '<button class="btn btn-sm btn-ghost" data-use="' + c.id + '">切換</button>' +
        '<button class="btn btn-sm btn-ghost" data-edit="' + c.id + '">改</button>' +
        '</div>');
      row.querySelector('[data-use]').addEventListener('click', function () {
        st.activeChildId = c.id; ST.save(); S.render(); S.toast('已切換到 ' + c.name);
      });
      row.querySelector('[data-edit]').addEventListener('click', function () { editChild(c); });
      kids.appendChild(row);
    });
    var addC = S.el('<div style="padding:12px"><button class="btn btn-sm btn-soft btn-block">＋ 加小朋友</button></div>');
    addC.querySelector('button').addEventListener('click', function () { editChild(null); });
    kids.appendChild(addC);
    body.appendChild(kids);

    // PIN
    body.appendChild(S.el('<div class="p-section-title">安全</div>'));
    var sec = S.el('<div class="p-card"></div>');
    var pinBtn = S.el('<button class="btn btn-ghost btn-block">' + (st.pin ? '更改家長 PIN 碼' : '設定家長 PIN 碼') + '</button>');
    pinBtn.addEventListener('click', function () { setPinFlow(function () { S.render(); }); });
    sec.appendChild(pinBtn);
    body.appendChild(sec);

    // 資料
    body.appendChild(S.el('<div class="p-section-title">資料備份</div>'));
    var data = S.el('<div class="p-card"></div>');
    data.appendChild(S.el('<p class="small muted" style="margin:0 0 12px">' +
      S.tx({ yue: '所有進度只儲存喺呢部裝置嘅瀏覽器。換機或清快取前，記得匯出備份。', zh: '所有进度只储存在这台装置的浏览器。换机或清除缓存前，记得导出备份。', en: 'All progress lives only in this browser. Export a backup before switching devices.' }) +
      '</p>'));
    var exp = S.el('<button class="btn btn-soft btn-block">📤 匯出備份 JSON</button>');
    exp.addEventListener('click', function () {
      var blob = new Blob([ST.exportJSON()], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'step-by-step-backup-' + ST.todayKey() + '.json';
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 3000);
    });
    data.appendChild(exp);

    var imp = S.el('<button class="btn btn-ghost btn-block mt8">📥 匯入備份</button>');
    imp.addEventListener('click', function () {
      var inp = document.createElement('input');
      inp.type = 'file'; inp.accept = 'application/json,.json';
      inp.addEventListener('change', function () {
        var f = inp.files && inp.files[0]; if (!f) return;
        var fr = new FileReader();
        fr.onload = function () {
          if (ST.importJSON(fr.result)) { S.toast('匯入成功'); S.render(); }
          else S.toast('檔案讀唔到，可能唔係備份檔');
        };
        fr.readAsText(f);
      });
      inp.click();
    });
    data.appendChild(imp);

    var reset = S.el('<button class="btn btn-danger btn-block mt8">🗑️ 清空所有資料</button>');
    reset.addEventListener('click', function () {
      S.confirmBox('清空所有資料？', '小朋友檔案、任務改動、完成記錄同星星會全部消失，無法還原。', function () {
        ST.resetAll(); S.toast('已重設'); S.go('/');
      }, '確定清空');
    });
    data.appendChild(reset);
    body.appendChild(data);

    var back = S.el('<a class="btn btn-primary btn-block mt24" href="#/parent/home">返控制台</a>');
    body.appendChild(back);

    return wrap([head('設定', '/parent/home'), body]);
  }

  function editChild(c) {
    var isNew = !c;
    var d = c || { name: '', age: 7, avatar: '🐣', scarf: '#1F9E94' };
    S.modal({
      title: isNew ? '加小朋友' : '改小朋友資料',
      body: '<div class="field"><label>名</label><input type="text" id="ec-name" value="' + S.esc(d.name) + '" maxlength="12"></div>' +
        '<div class="field"><label>年齡</label><input type="number" id="ec-age" value="' + (d.age || 7) + '" min="3" max="14"></div>' +
        '<div class="field"><label>頭像</label><div class="chip-row" id="ec-ava"></div></div>' +
        '<div class="field"><label>Gin 頸巾顏色</label><div class="chip-row" id="ec-scarf"></div></div>' +
        (isNew ? '' : '<button class="btn btn-danger btn-block mt8" id="ec-del">刪除呢個小朋友</button>'),
      actions: [
        { label: '取消', cls: 'btn-ghost' },
        {
          label: '儲存', cls: 'btn-primary', onClick: function () {
            var name = document.getElementById('ec-name').value.trim();
            if (!name) { S.toast('要填名'); return; }
            if (isNew) ST.addChild(name, +document.getElementById('ec-age').value || 7, d.avatar, d.scarf);
            else ST.updateChild(c.id, { name: name, age: +document.getElementById('ec-age').value || 7, avatar: d.avatar, scarf: d.scarf });
            S.render();
          }
        }
      ],
      onOpen: function (box, close) {
        var ava = box.querySelector('#ec-ava');
        ST.AVATARS.forEach(function (a) {
          var b = S.el('<button class="chip ' + (d.avatar === a ? 'sel' : '') + '" style="font-size:24px">' + a + '</button>');
          b.addEventListener('click', function () {
            d.avatar = a;
            ava.querySelectorAll('.chip').forEach(function (x) { x.classList.remove('sel'); });
            b.classList.add('sel');
          });
          ava.appendChild(b);
        });
        var sc = box.querySelector('#ec-scarf');
        ST.SCARVES.forEach(function (col) {
          var b = S.el('<button class="chip" style="background:' + col + ';width:44px;height:44px;border-radius:50%;padding:0"></button>');
          if (d.scarf === col) b.style.boxShadow = '0 0 0 4px rgba(43,43,43,.25)';
          b.addEventListener('click', function () {
            d.scarf = col;
            sc.querySelectorAll('.chip').forEach(function (x) { x.style.boxShadow = ''; });
            b.style.boxShadow = '0 0 0 4px rgba(43,43,43,.25)';
          });
          sc.appendChild(b);
        });
        var del = box.querySelector('#ec-del');
        if (del) del.addEventListener('click', function () {
          close();
          S.confirmBox('刪除小朋友？', '「' + S.esc(d.name) + '」嘅完成記錄同星星會一併消失。', function () {
            ST.removeChild(c.id); S.render();
          }, '刪除');
        });
      }
    });
  }

  /* ==================== 註冊 ==================== */
  function register(route) {
    route('/parent', function () {
      parentGate(function () { S.go('/parent/home'); });
      return wrap([head('家長設定'), S.el('<div class="wrap muted center" style="padding-top:40px">請輸入 PIN 碼</div>')]);
    });
    route('/parent/home', dashboard);
    route('/parent/tasks', taskLibrary);
    route('/parent/edit/:id', taskEdit);
    route('/parent/schedule', schedule);
    route('/parent/report', report);
    route('/parent/settings', settings);
    route('/parent/children', function () { return settings(); });
  }

  global.SBS_PARENT = {
    register: register,
    onboarding: onboarding,
    parentGate: parentGate,
    setPinFlow: setPinFlow,
    dashboard: dashboard
  };
})(window);
