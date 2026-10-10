/* ============================================================
   「一步一步」— App 核心：路由、UI 工具、啟動
   ============================================================ */
(function (global) {
  'use strict';

  var app = document.getElementById('app');
  var toastRoot = document.getElementById('toast-root');
  var modalRoot = document.getElementById('modal-root');

  /* ---------- 工具 ---------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function el(html) {
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  /* 多個根元素時用：逐個 append 入 parent，回傳節點陣列 */
  function appendHTML(parent, html) {
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    var nodes = Array.prototype.slice.call(t.content.childNodes); // 先快照，避免 append 時 list 被改動
    var added = [];
    nodes.forEach(function (n) {
      if (n.nodeType === 1) { parent.appendChild(n); added.push(n); }
      else if (n.nodeType === 3 && n.textContent.trim()) { parent.appendChild(document.createTextNode(n.textContent)); }
    });
    return added;
  }

  var toastTimer = null;
  function toast(msg, ms) {
    var t = el('<div class="toast">' + esc(msg) + '</div>');
    toastRoot.appendChild(t);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      t.style.transition = 'opacity 300ms';
      t.style.opacity = '0';
      setTimeout(function () { t.remove(); }, 320);
    }, ms || 2200);
    while (toastRoot.children.length > 3) toastRoot.removeChild(toastRoot.firstChild);
  }

  /* ---------- Modal ---------- */
  function modal(opts) {
    opts = opts || {};
    var acts = (opts.actions || []).map(function (a, i) {
      return '<button class="btn ' + (a.cls || 'btn-ghost') + '" data-mi="' + i + '">' + esc(a.label) + '</button>';
    }).join('');
    var box = el(
      '<div style="position:absolute;inset:0">' +
      '<div class="modal-mask" data-mclose="1"></div>' +
      '<div class="modal-box">' +
      (opts.title ? '<h3>' + esc(opts.title) + '</h3>' : '') +
      '<div class="modal-body">' + (opts.body || '') + '</div>' +
      (acts ? '<div class="modal-actions">' + acts + '</div>' : '') +
      '</div></div>'
    );
    modalRoot.innerHTML = '';
    modalRoot.appendChild(box);
    modalRoot.classList.add('open');

    function close() { modalRoot.classList.remove('open'); modalRoot.innerHTML = ''; }
    box.addEventListener('click', function (e) {
      if (e.target.dataset.mclose) { if (opts.dismissible !== false) close(); return; }
      var i = e.target.closest('[data-mi]');
      if (i) {
        var a = opts.actions[+i.dataset.mi];
        if (a.keepOpen) { a.onClick && a.onClick(box, close); }
        else { close(); a.onClick && a.onClick(box, close); }
      }
    });
    if (opts.onOpen) opts.onOpen(box, close);
    return { close: close, box: box };
  }

  function confirmBox(title, body, onYes, yesLabel) {
    modal({
      title: title, body: '<p class="muted" style="margin:0">' + body + '</p>',
      actions: [
        { label: '取消', cls: 'btn-ghost' },
        { label: yesLabel || '確定', cls: 'btn-primary', onClick: onYes }
      ]
    });
  }

  /* ---------- 路由 ---------- */
  var routes = [];
  function route(pattern, fn) {
    routes.push({ parts: pattern.split('/').filter(Boolean), fn: fn });
  }

  function currentPath() {
    var h = location.hash.replace(/^#/, '');
    return h || '/';
  }

  function go(path, replace) {
    if (location.hash === '#' + path) { render(); return; }
    if (replace) location.replace('#' + path);
    else location.hash = path;
  }

  function render() {
    var path = currentPath();
    var parts = path.split('/').filter(Boolean);
    var matched = null, params = {};
    for (var i = 0; i < routes.length; i++) {
      var r = routes[i];
      if (r.parts.length !== parts.length) continue;
      var ok = true; var p = {};
      for (var j = 0; j < r.parts.length; j++) {
        if (r.parts[j][0] === ':') p[r.parts[j].slice(1)] = decodeURIComponent(parts[j]);
        else if (r.parts[j] !== parts[j]) { ok = false; break; }
      }
      if (ok) { matched = r; params = p; break; }
    }
    // 切換模式樣式
    var isParent = path.indexOf('/parent') === 0;
    document.body.classList.toggle('parent-mode', isParent);

    app.innerHTML = '';
    if (!matched) {
      app.appendChild(el('<div class="wrap center" style="padding-top:80px">' +
        '<div style="font-size:64px">🐾</div><h2>搵唔到呢一頁</h2>' +
        '<p class="muted">Gin 帶你返去主頁啦</p>' +
        '<button class="btn btn-primary mt16" onclick="location.hash=\'/\'">返主頁</button></div>'));
      return;
    }
    if (global.SBS_SPEECH) global.SBS_SPEECH.stop();
    var node = matched.fn(params, path);
    if (node) app.appendChild(node);
    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', render);

  /* ---------- 長按輔助 ---------- */
  function holdToConfirm(node, opts) {
    opts = opts || {};
    var dur = opts.duration || 1000;
    var fill = node.querySelector('.fill');
    var raf = null, start = 0, active = false, done = false;

    function tick() {
      if (!active) return;
      var p = Math.min(1, (Date.now() - start) / dur);
      if (fill) fill.style.transform = 'scale(' + p + ')';
      if (p >= 1) {
        active = false; done = true;
        node.classList.add('filled');
        if (navigator.vibrate) { try { navigator.vibrate(25); } catch (e) { } }
        opts.onComplete && opts.onComplete();
        setTimeout(reset, 420);
        return;
      }
      raf = requestAnimationFrame(tick);
    }
    function reset() {
      active = false;
      if (raf) cancelAnimationFrame(raf);
      if (fill) fill.style.transform = 'scale(0)';
      node.classList.remove('filled');
      setTimeout(function () { done = false; }, 60);
    }
    function begin(e) {
      if (done) return;
      e.preventDefault();
      active = true; start = Date.now();
      node.setPointerCapture && e.pointerId != null && node.setPointerCapture(e.pointerId);
      tick();
    }
    function end() { if (active) { reset(); opts.onCancel && opts.onCancel(); } }

    node.addEventListener('pointerdown', begin);
    node.addEventListener('pointerup', end);
    node.addEventListener('pointerleave', end);
    node.addEventListener('pointercancel', end);
    node.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    return { reset: reset };
  }

  /* ---------- 語言輔助 ---------- */
  function lang() {
    return global.SBS_STORE.load().settings.voice || 'yue';
  }
  function tx(obj) {
    if (obj == null) return '';
    if (typeof obj === 'string') return obj;
    return obj[lang()] || obj.yue || obj.zh || obj.en || '';
  }

  /* ---------- 設定套用 ---------- */
  function applySettings() {
    var s = global.SBS_STORE.load().settings;
    document.body.classList.toggle('no-anim', !!s.reduceMotion);
    document.body.classList.toggle('big-text', !!s.bigText);
  }

  /* ---------- 語音浮標 ---------- */
  var VOICE_CYCLE = ['yue', 'zh', 'en'];
  function voiceFab() {
    var s = global.SBS_STORE.load();
    var cur = s.settings.voice || 'yue';
    var L = global.SBS_SPEECH.LANGS[cur];
    var next = VOICE_CYCLE[(VOICE_CYCLE.indexOf(cur) + 1) % 3];
    var node = el(
      '<button class="voice-fab" title="切換朗讀語言">' +
      '<span class="sp">' + L.flag + '</span><span>' + L.label + '</span></button>'
    );
    node.addEventListener('click', function () {
      var st = global.SBS_STORE.load();
      st.settings.voice = next;
      global.SBS_STORE.save();
      global.SBS_SPEECH.stop();
      toast('朗讀語言：' + global.SBS_SPEECH.LANGS[next].label);
      global.SBS_SPEECH.speak(global.SBS_SPEECH.LANGS[next].label, { lang: next });
      render();
    });
    return node;
  }

  /* ---------- 底部導航 ---------- */
  function tabbar(active) {
    var tabs = [
      { key: 'home', icon: '🏠', label: '今日', href: '/kid/home' },
      { key: 'games', icon: '🎮', label: '玩吓', href: '/kid/games' },
      { key: 'stars', icon: '⭐', label: '星星罐', href: '/kid/stars' },
      { key: 'map', icon: '🗺️', label: '我嘅地圖', href: '/kid/map' }
    ];
    var html = '<nav class="tabbar">' + tabs.map(function (t) {
      return '<a class="tab ' + (active === t.key ? 'on' : '') + '" href="#' + t.href + '">' +
        '<span class="ti">' + t.icon + '</span><span>' + esc(t.label) + '</span></a>';
    }).join('') + '</nav>';
    return el(html);
  }

  /* ---------- 頂欄 ---------- */
  function topbar(opts) {
    opts = opts || {};
    var b = el('<header class="topbar ' + (opts.parent ? 'parent' : '') + '"></header>');
    if (opts.back) {
      var back = el('<button class="icon-btn small" aria-label="返回">‹</button>');
      back.style.fontSize = '34px';
      back.addEventListener('click', function () { opts.back(); });
      b.appendChild(back);
    }
    if (opts.title) b.appendChild(el('<div class="title">' + esc(opts.title) + '</div>'));
    if (opts.right) {
      var r = el('<div class="row" style="margin-left:auto;gap:8px"></div>');
      (Array.isArray(opts.right) ? opts.right : [opts.right]).forEach(function (n) { r.appendChild(n); });
      b.appendChild(r);
    }
    return b;
  }

  /* ---------- PIN 長按進入家長端 ---------- */
  function parentLockButton(afterFn) {
    var btn = el('<button class="icon-btn small" style="opacity:.7" aria-label="家長設定">⚙️</button>');
    var timer = null;
    function start(e) {
      e.preventDefault();
      timer = setTimeout(function () {
        timer = null;
        if (navigator.vibrate) { try { navigator.vibrate(30); } catch (x) { } }
        global.SBS.parentGate(afterFn);
      }, 2000);
    }
    function cancel() { if (timer) { clearTimeout(timer); timer = null; } }
    btn.addEventListener('pointerdown', start);
    btn.addEventListener('pointerup', cancel);
    btn.addEventListener('pointerleave', cancel);
    btn.addEventListener('click', function (e) { e.preventDefault(); if (!timer) toast('長按 2 秒，先入到家長設定'); });
    return btn;
  }

  /* ---------- 啟動 ---------- */
  function boot() {
    var s = global.SBS_STORE.load();
    applySettings();

    // 註冊 Service Worker（離線可用）
    if ('serviceWorker' in navigator && location.protocol !== 'file:') {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('sw.js').catch(function () { /* 忽略 */ });
      });
    }

    global.SBS_KID && global.SBS_KID.register(route);
    global.SBS_GAMES && global.SBS_GAMES.register(route);
    global.SBS_PARENT && global.SBS_PARENT.register(route);
    global.SBS_EF && global.SBS_EF.register(route);

    route('/', function () {
      var st = global.SBS_STORE.load();
      if (!st.onboarded || !st.children.length) return global.SBS_PARENT.onboarding();
      return global.SBS_KID.pickChild();
    });

    if (!location.hash) location.replace('#/');
    render();
  }

  global.SBS = {
    esc: esc, el: el, appendHTML: appendHTML, toast: toast, modal: modal, confirmBox: confirmBox,
    route: route, go: go, render: render,
    holdToConfirm: holdToConfirm,
    lang: lang, tx: tx,
    applySettings: applySettings,
    voiceFab: voiceFab, tabbar: tabbar, topbar: topbar,
    parentLockButton: parentLockButton,
    boot: boot
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window);
