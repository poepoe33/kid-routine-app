/* ============================================================
   「一步一步」— 語音合成（Web Speech API / SpeechSynthesis）
   廣東話 zh-HK 為主，普通話 zh-CN 與英文 en-US 作備選。
   完全喺瀏覽器本地合成，唔需要網絡。
   ============================================================ */
(function (global) {
  'use strict';

  var LANGS = {
    yue: { code: 'zh-HK', label: '廣東話', short: '粵', flag: '🇭🇰' },
    zh: { code: 'zh-CN', label: '普通話', short: '普', flag: '🇨🇳' },
    en: { code: 'en-US', label: 'English', short: 'EN', flag: '🇬🇧' }
  };

  var voices = [];
  var ready = false;
  var listeners = [];

  function supported() {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  function refreshVoices() {
    if (!supported()) return;
    voices = window.speechSynthesis.getVoices() || [];
    ready = voices.length > 0;
    listeners.forEach(function (fn) { fn(voices); });
  }

  if (supported()) {
    refreshVoices();
    if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
      window.speechSynthesis.onvoiceschanged = refreshVoices;
    }
    // Safari / 舊版 Chrome 需要輪詢一次
    setTimeout(refreshVoices, 300);
    setTimeout(refreshVoices, 1200);
  }

  function onVoicesReady(fn) {
    listeners.push(fn);
    if (ready) fn(voices);
  }

  /* 依語言挑選最合適嘅聲音
     1) 完全符合（zh-HK）
     2) 主語言符合（zh）
     3) 地區變體（zh-TW 亦可讀粵語文本）
     4) 系統預設 */
  function pickVoice(langKey) {
    var target = (LANGS[langKey] || LANGS.yue).code;
    var main = target.split('-')[0];
    if (!voices.length) return null;
    var exact = voices.filter(function (v) { return (v.lang || '').replace('_', '-') === target; });
    if (exact.length) return exact[0];
    var prefix = voices.filter(function (v) { return (v.lang || '').replace('_', '-').split('-')[0] === main; });
    if (prefix.length) {
      // 廣東話優先揀含 HK / Cantonese 關鍵字嘅
      if (langKey === 'yue') {
        var cantonese = prefix.filter(function (v) {
          return /HK|Cantonese|粵|粤/i.test(v.name + ' ' + v.lang);
        });
        if (cantonese.length) return cantonese[0];
      }
      return prefix[0];
    }
    return null;
  }

  function voiceStatus() {
    var out = {};
    Object.keys(LANGS).forEach(function (k) {
      var v = pickVoice(k);
      out[k] = { available: !!v, voiceName: v ? v.name : null };
    });
    return out;
  }

  var current = null;

  function speak(text, opts) {
    opts = opts || {};
    if (!text) return;
    if (!supported()) {
      if (global.SBS && global.SBS.toast) global.SBS.toast('呢個瀏覽器唔支援語音朗讀');
      return;
    }
    var st = global.SBS_STORE.load();
    var langKey = opts.lang || st.settings.voice || 'yue';
    var lang = LANGS[langKey] || LANGS.yue;

    try { window.speechSynthesis.cancel(); } catch (e) { /* noop */ }

    var u = new SpeechSynthesisUtterance(text);
    u.lang = lang.code;
    u.rate = opts.rate || st.settings.rate || 0.9;
    u.pitch = opts.pitch || 1.05;
    u.volume = 1;

    var v = pickVoice(langKey);
    if (v) u.voice = v;

    if (opts.onstart) u.onstart = opts.onstart;
    u.onend = function () {
      if (opts.onend) opts.onend();
      current = null;
    };
    u.onerror = function () {
      if (opts.onend) opts.onend();
      current = null;
    };

    current = u;
    // Chrome 有時需要一個小延遲先 cancel 得徹底
    setTimeout(function () {
      try { window.speechSynthesis.speak(u); } catch (e) { /* noop */ }
    }, 30);
    return u;
  }

  function stop() {
    if (supported()) {
      try { window.speechSynthesis.cancel(); } catch (e) { /* noop */ }
    }
    current = null;
  }

  /* 讀一段步驟文字：自動揀目前語言 */
  function speakStep(step, opts) {
    var st = global.SBS_STORE.load();
    var langKey = (opts && opts.lang) || st.settings.voice || 'yue';
    var text = step[langKey] || step.yue;
    return speak(text, opts);
  }

  function speakTaskTitle(task, opts) {
    var st = global.SBS_STORE.load();
    var langKey = (opts && opts.lang) || st.settings.voice || 'yue';
    return speak(task.title[langKey] || task.title.yue, opts);
  }

  global.SBS_SPEECH = {
    LANGS: LANGS,
    supported: supported,
    pickVoice: pickVoice,
    onVoicesReady: onVoicesReady,
    voiceStatus: voiceStatus,
    speak: speak,
    speakStep: speakStep,
    speakTaskTitle: speakTaskTitle,
    stop: stop,
    isSpeaking: function () { return supported() && window.speechSynthesis.speaking; }
  };
})(window);
