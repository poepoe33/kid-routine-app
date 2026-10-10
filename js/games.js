/* ============================================================
   「一步一步」— 互動遊戲與練習
   三個小遊戲：記憶配對、步驟排一排、聽聲選卡
   全部配合語音朗讀，強化「步驟」概念，唔做排行榜。
   ============================================================ */
(function (global) {
  'use strict';

  var S = global.SBS, ST = global.SBS_STORE, SP = global.SBS_SPEECH, M = global.SBS_MASCOT;

  function view(nodes, activeTab) {
    var v = S.el('<div class="view"></div>');
    nodes.forEach(function (n) { if (n) v.appendChild(n); });
    if (activeTab) v.appendChild(S.tabbar(activeTab));
    return v;
  }

  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function record(game, score) {
    var st = ST.load();
    st.gameStats[game] = st.gameStats[game] || [];
    st.gameStats[game].push({ ts: Date.now(), score: score });
    if (st.gameStats[game].length > 50) st.gameStats[game] = st.gameStats[game].slice(-50);
    ST.saveSoon();
  }

  /* ==================== 遊戲大廳 ==================== */
  function lobby() {
    var head = S.topbar({ title: S.tx({ yue: '同 Gin 玩吓', zh: '和 Gin 玩一会', en: 'Play with Gin' }), back: function () { S.go('/kid/home'); } });
    var body = S.el('<div class="wrap"></div>');
    var child = ST.activeChild();

    body.appendChild(S.el('<div class="card row mt16" style="gap:16px;align-items:center">' +
      '<div style="flex:0 0 88px">' + M.gin({ scarf: (child || {}).scarf || '#1F9E94', anim: 'wave', size: 88 }) + '</div>' +
      '<div class="grow"><div style="font-size:19px;font-weight:800">' +
      S.tx({ yue: '揀一個遊戲啦！', zh: '选一个游戏吧！', en: 'Pick a game!' }) +
      '</div><div class="small muted mt8">' +
      S.tx({ yue: '玩完唔會加分，淨係想你熟啲啲步驟。', zh: '玩完不会加分，只是想你熟一点步骤。', en: 'No scores here — just practise the steps.' }) +
      '</div></div></div>'));

    var games = [
      { href: '/kid/game/memory', icon: '🧠', name: { yue: '記憶配對', zh: '记忆配对', en: 'Memory Match' }, desc: { yue: '記住邊張卡喺邊度，配對佢哋', zh: '记住卡片的位置，把它们配对', en: 'Remember where the cards are and match them' } },
      { href: '/kid/game/order', icon: '🔢', name: { yue: '步驟排一排', zh: '步骤排一排', en: 'Put Steps in Order' }, desc: { yue: '將打亂咗嘅步驟排返正確次序', zh: '把打乱的步骤排回正确顺序', en: 'Put the mixed-up steps back in order' } },
      { href: '/kid/game/listen', icon: '👂', name: { yue: '聽聲選卡', zh: '听声选卡', en: 'Listen & Pick' }, desc: { yue: '聽 Gin 讀一步，揀返正確嘅卡', zh: '听 Gin 读一步，选出正确的卡片', en: 'Listen to Gin and pick the right card' } }
    ];

    games.forEach(function (g) {
      var n = S.el('<button class="task-card" style="min-height:118px">' +
        '<span class="tc-icon">' + g.icon + '</span>' +
        '<span class="grow" style="text-align:left">' +
        '<span class="tc-name" style="display:block;font-size:24px">' + S.tx(g.name) + '</span>' +
        '<span class="tc-sub" style="display:block;margin-top:6px">' + S.tx(g.desc) + '</span>' +
        '</span></button>');
      n.addEventListener('click', function () { S.go(g.href); });
      body.appendChild(n);
    });

    return view([head, body], 'games');
  }

  /* ==================== 記憶配對 ==================== */
  function memory() {
    var head = S.topbar({ title: S.tx({ yue: '記憶配對', zh: '记忆配对', en: 'Memory Match' }), back: function () { S.go('/kid/games'); } });
    var body = S.el('<div class="wrap center"></div>');

    var pool = shuffle(ST.tasks().filter(function (t) { return t.enabled; })).slice(0, 8);
    if (pool.length < 4) pool = shuffle(ST.tasks()).slice(0, 8);
    var cards = shuffle(pool.concat(pool)).map(function (t, i) {
      return { id: i, task: t, flipped: false, matched: false };
    });

    var moves = 0, open = [], lock = false;
    var stat = S.el('<div class="game-stat"><span>🧮 步數：<b id="m-moves">0</b></span><span>✅ 配對：<b id="m-pairs">0</b>/' + pool.length + '</span></div>');
    var grid = S.el('<div class="mem-grid"></div>');
    var movesEl = stat.querySelector('#m-moves');
    var pairsEl = stat.querySelector('#m-pairs');
    body.appendChild(stat);
    body.appendChild(grid);

    function paint() {
      grid.innerHTML = cards.map(function (c) {
        return '<button class="mem-card ' + (c.flipped ? 'flipped ' : '') + (c.matched ? 'matched' : '') + '" data-i="' + c.id + '">' +
          '<span class="face back">🐾</span>' +
          '<span class="face front">' + c.task.icon + '</span></button>';
      }).join('');
      grid.querySelectorAll('.mem-card').forEach(function (n) {
        n.addEventListener('click', function () { flip(+n.dataset.i); });
      });
      movesEl.textContent = moves;
      pairsEl.textContent = cards.filter(function (c) { return c.matched; }).length / 2;
    }

    function flip(i) {
      if (lock) return;
      var c = cards[i];
      if (c.flipped || c.matched) return;
      c.flipped = true; paint();
      SP.speak(S.tx(c.task.title));
      open.push(c);
      if (open.length === 2) {
        moves++; lock = true;
        var a = open[0], b = open[1];
        if (a.task.id === b.task.id) {
          a.matched = b.matched = true;
          open = []; lock = false;
          paint();
          if (cards.every(function (x) { return x.matched; })) {
            record('memory', moves);
            setTimeout(win, 500);
          }
        } else {
          setTimeout(function () {
            a.flipped = b.flipped = false; open = []; lock = false; paint();
          }, 900);
        }
      }
    }

    function win() {
      SP.speak(S.tx({ yue: '全部配對晒，你個腦好記得嘢！', zh: '全部配对完成，你的记性真好！', en: 'All matched — what a great memory!' }));
      S.modal({
        title: S.tx({ yue: '配對完成！', zh: '配对完成！', en: 'All matched!' }),
        body: '<div class="center" style="font-size:56px">' + M.gin({ size: 130, anim: 'spin', scarf: '#1F9E94' }) + '</div>' +
          '<p class="center" style="margin:8px 0 0">用了 ' + moves + ' 步</p>',
        actions: [
          { label: S.tx({ yue: '再玩一次', zh: '再玩一次', en: 'Play again' }), cls: 'btn-primary', onClick: function () { S.go('/kid/game/memory'); S.render(); } },
          { label: S.tx({ yue: '返去', zh: '回去', en: 'Back' }), cls: 'btn-ghost', onClick: function () { S.go('/kid/games'); } }
        ]
      });
    }

    paint();
    return view([head, body]);
  }

  /* ==================== 步驟排一排 ==================== */
  function order() {
    var head = S.topbar({ title: S.tx({ yue: '步驟排一排', zh: '步骤排一排', en: 'Put Steps in Order' }), back: function () { S.go('/kid/games'); } });
    var body = S.el('<div class="wrap"></div>');

    var pool = ST.tasks().filter(function (t) { return t.enabled && t.steps.length >= 4; });
    if (!pool.length) pool = ST.tasks();
    var t = pool[Math.floor(Math.random() * pool.length)];
    var items = shuffle(t.steps.map(function (s, i) { return { step: s, correct: i }; }));
    var sel = null;

    body.appendChild(S.el('<div class="card center mt16">' +
      '<div style="font-size:22px;font-weight:800">' + t.icon + ' ' + S.tx(t.title) + '</div>' +
      '<div class="small muted mt8">' + S.tx({ yue: '撳兩張卡交換位置，排返正確次序', zh: '点两张卡交换位置，排回正确顺序', en: 'Tap two cards to swap them into the right order' }) + '</div>' +
      '</div>'));

    var list = S.el('<div class="order-list mt16"></div>');
    body.appendChild(list);

    function paint(showAnswer) {
      list.innerHTML = items.map(function (it, i) {
        var cls = 'order-item' +
          (sel === i ? ' selected' : '') +
          (showAnswer ? (items[i].correct === i ? ' correct' : '') : '');
        return '<button class="' + cls + '" data-i="' + i + '">' +
          '<span class="no">' + (i + 1) + '</span>' +
          '<span class="ic">' + it.step.icon + '</span>' +
          '<span class="tx grow" style="text-align:left">' + S.esc(S.tx(it.step)) + '</span>' +
          (showAnswer ? '<span>' + (items[i].correct === i ? M.check(26) : '') + '</span>' : '') +
          '</button>';
      }).join('');
      list.querySelectorAll('.order-item').forEach(function (n) {
        n.addEventListener('click', function () { tap(+n.dataset.i); });
      });
    }

    function tap(i) {
      if (sel === null) { sel = i; paint(false); SP.speak(S.tx(items[i].step)); return; }
      if (sel === i) { sel = null; paint(false); return; }
      var tmp = items[sel]; items[sel] = items[i]; items[i] = tmp;
      sel = null; paint(false);
      if (navigator.vibrate) { try { navigator.vibrate(15); } catch (e) { } }
    }

    var acts = S.el('<div class="col mt16" style="max-width:620px;margin-left:auto;margin-right:auto"></div>');
    var checkBtn = S.el('<button class="btn btn-primary btn-block">✔ ' + S.tx({ yue: '對答案', zh: '对答案', en: 'Check' }) + '</button>');
    var againBtn = S.el('<button class="btn btn-orange btn-block">' + S.tx({ yue: '再玩一次', zh: '再玩一次', en: 'Play again' }) + '</button>');
    checkBtn.addEventListener('click', function () {
      var ok = items.every(function (it, i) { return it.correct === i; });
      paint(true);
      SP.speak(ok
        ? S.tx({ yue: '次序啱晒，你好清楚要做咩！', zh: '顺序全对，你很清楚要做什么！', en: 'Perfect order — you know just what to do!' })
        : S.tx({ yue: '差少少，我哋睇吓正確次序啦', zh: '差一点，我们看看正确的顺序吧', en: 'Nearly there — let\'s look at the right order' }));
      record('order', ok ? 1 : 0);
      if (ok) {
        setTimeout(function () {
          S.modal({
            title: S.tx({ yue: '全部啱晒！', zh: '全部都对！', en: 'All correct!' }),
            body: '<div class="center">' + M.gin({ size: 130, anim: 'jump', mood: 'cheer', scarf: '#1F9E94' }) + '</div>',
            actions: [
              { label: S.tx({ yue: '再玩一次', zh: '再玩一次', en: 'Again' }), cls: 'btn-primary', onClick: function () { S.go('/kid/game/order'); S.render(); } },
              { label: S.tx({ yue: '返去', zh: '回去', en: 'Back' }), cls: 'btn-ghost', onClick: function () { S.go('/kid/games'); } }
            ]
          });
        }, 700);
      }
    });
    againBtn.addEventListener('click', function () { S.go('/kid/game/order'); S.render(); });
    acts.appendChild(checkBtn);
    acts.appendChild(againBtn);
    body.appendChild(acts);

    paint(false);
    return view([head, body]);
  }

  /* ==================== 聽聲選卡 ==================== */
  function listen() {
    var head = S.topbar({ title: S.tx({ yue: '聽聲選卡', zh: '听声选卡', en: 'Listen & Pick' }), back: function () { S.go('/kid/games'); } });
    var body = S.el('<div class="wrap center"></div>');

    var tasks = ST.tasks().filter(function (t) { return t.enabled; });
    if (tasks.length < 4) tasks = ST.tasks();

    var round = 0, score = 0, answer = null, answered = false;

    var prog = S.el('<div class="game-stat"><span>🎯 第 <b id="l-round">1</b>/5 題</span><span>✅ 中：<b id="l-score">0</b></span></div>');
    var sayBox = S.el('<div class="card mt8" style="padding:22px"></div>');
    var opts = S.el('<div class="listen-options"></div>');
    var roundEl = prog.querySelector('#l-round');
    var scoreEl = prog.querySelector('#l-score');
    body.appendChild(prog);
    body.appendChild(sayBox);
    body.appendChild(opts);

    function next() {
      answered = false;
      round++;
      roundEl.textContent = Math.min(round, 5);
      scoreEl.textContent = score;

      var t = tasks[Math.floor(Math.random() * tasks.length)];
      var correct = t.steps[Math.floor(Math.random() * t.steps.length)];
      answer = correct;

      var others = shuffle(tasks.filter(function (x) { return x.id !== t.id; }))
        .slice(0, 3)
        .map(function (x) { return x.steps[Math.floor(Math.random() * x.steps.length)]; });
      var options = shuffle([correct].concat(others));

      sayBox.innerHTML =
        '<div style="font-size:44px">' + M.gin({ size: 92, scarf: '#1F9E94' }) + '</div>' +
        '<div class="small muted mt8">' + S.tx({ yue: 'Gin 講緊邊一步？', zh: 'Gin 在说哪一步？', en: 'Which step is Gin saying?' }) + '</div>' +
        '<div class="row" style="justify-content:center;margin-top:12px">' +
        '<button class="btn btn-soft btn-sm" id="l-play">🔊 ' + S.tx({ yue: '再聽一次', zh: '再听一次', en: 'Play again' }) + '</button>' +
        '</div>';

      opts.innerHTML = options.map(function (s, i) {
        return '<button class="listen-opt" data-i="' + i + '">' +
          '<span class="ic">' + s.icon + '</span><span class="tx">' + S.esc(S.tx(s)) + '</span></button>';
      }).join('');

      sayBox.querySelector('#l-play').addEventListener('click', function () { SP.speakStep(correct); });
      opts.querySelectorAll('.listen-opt').forEach(function (n, i) {
        n.addEventListener('click', function () { pick(n, options[i], correct); });
      });

      setTimeout(function () { SP.speakStep(correct); }, 400);
    }

    function pick(node, chosen, correct) {
      if (answered) return;
      answered = true;
      if (chosen.id === correct.id) {
        score++;
        node.classList.add('correct');
        SP.speak(S.tx({ yue: '啱喇！', zh: '对了！', en: 'Correct!' }));
      } else {
        node.classList.add('wrong');
        opts.querySelectorAll('.listen-opt').forEach(function (n, i) {
          if (n === node) return;
        });
        opts.querySelectorAll('.listen-opt').forEach(function (n) {
          var tx = n.querySelector('.tx').textContent;
          if (tx === S.tx(correct)) n.classList.add('correct');
        });
        SP.speak(S.tx({ yue: '係呢一步呀', zh: '是这一步哦', en: 'It was this step' }));
      }
      scoreEl.textContent = score;
      setTimeout(function () {
        if (round >= 5) {
          record('listen', score);
          S.modal({
            title: S.tx({ yue: '玩完啦！', zh: '玩完啦！', en: 'Round complete!' }),
            body: '<div class="center">' + M.gin({ size: 130, anim: 'jump', mood: 'cheer', scarf: '#1F9E94' }) + '</div>' +
              '<p class="center mt8" style="font-size:18px;font-weight:800">中咗 ' + score + ' / 5</p>' +
              '<p class="center muted small">' + S.tx({ yue: '聽得清楚好緊要，下次再嚟！', zh: '听得清楚很重要，下次再来！', en: 'Good listening — come back anytime!' }) + '</p>',
            actions: [
              { label: S.tx({ yue: '再玩一次', zh: '再玩一次', en: 'Again' }), cls: 'btn-primary', onClick: function () { score = 0; round = 0; next(); } },
              { label: S.tx({ yue: '返去', zh: '回去', en: 'Back' }), cls: 'btn-ghost', onClick: function () { S.go('/kid/games'); } }
            ]
          });
        } else next();
      }, 1400);
    }

    next();
    return view([head, body]);
  }

  function register(route) {
    route('/kid/games', lobby);
    route('/kid/game/memory', memory);
    route('/kid/game/order', order);
    route('/kid/game/listen', listen);
  }

  global.SBS_GAMES = { register: register };
})(window);
