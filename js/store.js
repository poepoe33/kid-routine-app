/* ============================================================
   「一步一步」— 本地儲存層（localStorage）
   所有進度只存放於瀏覽器本地，不傳送到任何伺服器。
   ============================================================ */
(function (global) {
  'use strict';

  var KEY = 'stepbystep.state.v1';
  var VERSION = 1;

  function todayKey(d) {
    var dt = d || new Date();
    var y = dt.getFullYear();
    var m = ('0' + (dt.getMonth() + 1)).slice(-2);
    var day = ('0' + dt.getDate()).slice(-2);
    return y + '-' + m + '-' + day;
  }

  function dateKeyOffset(n) {
    var d = new Date();
    d.setDate(d.getDate() + n);
    return todayKey(d);
  }

  function uid(prefix) {
    return (prefix || 'id') + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
  }

  var AVATARS = ['🐣', '🐯', '🐰', '🦊', '🐼', '🦁', '🐨', '🐵', '🦄', '🐙'];
  var SCARVES = ['#1F9E94', '#F07A1F', '#E86A6A', '#5B8DEF', '#B26BD6', '#3FA34D'];

  function defaultState() {
    return {
      version: VERSION,
      createdAt: Date.now(),
      pin: null,                 // null = 未設定，首次進入家長端會要求設定
      children: [],              // [{id,name,age,avatar,scarf}]
      activeChildId: null,
      tasks: global.SBS_DATA.buildTasks(),
      schedule: {},              // taskId -> {days:[0-6], slot:'morning'}
      completions: {},           // dateKey -> { taskId: {steps:{stepId:ts}, done:bool, stars:int, by:'kid'|'parent'} }
      helpCounts: {},            // stepId -> n （求助次數＝卡點）
      starsLedger: [],           // [{childId,delta,reason,date,ts}]
      settings: {
        voice: 'yue',            // yue | zh | en
        rate: 0.9,
        bigText: false,
        reduceMotion: false,
        autoSpeak: true          // 進入新步驟自動朗讀
      },
      gameStats: { memory: [], order: [], listen: [] },
      onboarded: false
    };
  }

  var state = null;

  function load() {
    if (state) return state;
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        state = JSON.parse(raw);
        // 補齊新版本新增欄位
        var def = defaultState();
        Object.keys(def).forEach(function (k) {
          if (state[k] === undefined) state[k] = def[k];
        });
        Object.keys(def.settings).forEach(function (k) {
          if (state.settings[k] === undefined) state.settings[k] = def.settings[k];
        });
        if (!Array.isArray(state.gameStats)) state.gameStats = def.gameStats;
        ['memory', 'order', 'listen'].forEach(function (g) {
          if (!Array.isArray(state.gameStats[g])) state.gameStats[g] = [];
        });
      } else {
        state = defaultState();
        // 預設時間表：沿用種子資料的 days / slot
        state.tasks.forEach(function (t) {
          state.schedule[t.id] = { days: t.days.slice(), slot: t.slot };
        });
        save();
      }
    } catch (e) {
      console.warn('[SBS] 讀取失敗，重置為預設值', e);
      state = defaultState();
    }
    return state;
  }

  var saveTimer = null;
  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('[SBS] 儲存失敗', e);
      if (global.SBS && global.SBS.toast) global.SBS.toast('儲存空間不足，可能係相片太多');
    }
  }
  function saveSoon() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(save, 200);
  }

  /* ---------- 小朋友檔案 ---------- */
  function children() { return load().children; }

  function activeChild() {
    var s = load();
    return s.children.find(function (c) { return c.id === s.activeChildId; }) || s.children[0] || null;
  }

  function addChild(name, age, avatar, scarf) {
    var s = load();
    var c = { id: uid('child'), name: name, age: age, avatar: avatar || '🐣', scarf: scarf || '#1F9E94' };
    s.children.push(c);
    if (!s.activeChildId) s.activeChildId = c.id;
    save();
    return c;
  }

  function updateChild(id, patch) {
    var s = load();
    var c = s.children.find(function (x) { return x.id === id; });
    if (c) Object.keys(patch).forEach(function (k) { c[k] = patch[k]; });
    save();
    return c;
  }

  function removeChild(id) {
    var s = load();
    s.children = s.children.filter(function (c) { return c.id !== id; });
    if (s.activeChildId === id) s.activeChildId = s.children.length ? s.children[0].id : null;
    save();
  }

  /* ---------- 任務 ---------- */
  function tasks() { return load().tasks; }
  function taskById(id) { return load().tasks.find(function (t) { return t.id === id; }); }
  function schedule() { return load().schedule; }

  function todayTasks(childId) {
    var s = load();
    var dow = new Date().getDay();
    return s.tasks.filter(function (t) {
      if (!t.enabled) return false;
      var sc = s.schedule[t.id];
      if (!sc) return true;
      return sc.days.indexOf(dow) !== -1;
    }).sort(function (a, b) {
      var sa = global.SBS_DATA.SLOTS.find(function (x) { return x.id === a.slot; });
      var sb = global.SBS_DATA.SLOTS.find(function (x) { return x.id === b.slot; });
      return (sa ? sa.order : 9) - (sb ? sb.order : 9);
    });
  }

  /* ---------- 完成記錄 ---------- */
  function dayRecord(dateKey) {
    var s = load();
    if (!s.completions[dateKey]) s.completions[dateKey] = {};
    return s.completions[dateKey];
  }

  function taskProgress(taskId, dateKey) {
    var rec = dayRecord(dateKey || todayKey())[taskId];
    return rec || { steps: {}, done: false, stars: 0, by: null };
  }

  function completeStep(taskId, stepId) {
    var s = load();
    var key = todayKey();
    var rec = dayRecord(key);
    if (!rec[taskId]) rec[taskId] = { steps: {}, done: false, stars: 0, by: null };
    if (!rec[taskId].steps[stepId]) rec[taskId].steps[stepId] = Date.now();
    saveSoon();
    return rec[taskId];
  }

  function uncompleteStep(taskId, stepId) {
    var s = load();
    var key = todayKey();
    var rec = dayRecord(key);
    if (rec[taskId]) {
      delete rec[taskId].steps[stepId];
      rec[taskId].done = false;
      rec[taskId].stars = 0;
    }
    saveSoon();
  }

  function finishTask(taskId, by) {
    var s = load();
    var key = todayKey();
    var rec = dayRecord(key);
    var t = taskById(taskId);
    if (!rec[taskId]) rec[taskId] = { steps: {}, done: false, stars: 0, by: null };
    if (rec[taskId].done) return rec[taskId];
    rec[taskId].done = true;
    rec[taskId].by = by || 'kid';
    rec[taskId].stars = t ? t.stars : 1;
    rec[taskId].finishedAt = Date.now();
    // 星星流水
    s.starsLedger.push({
      childId: s.activeChildId, delta: rec[taskId].stars,
      reason: t ? t.title.yue : taskId, date: key, ts: Date.now()
    });
    save();
    return rec[taskId];
  }

  function parentCompleteTask(taskId) {
    var s = load();
    var key = todayKey();
    var rec = dayRecord(key);
    var t = taskById(taskId);
    if (!rec[taskId]) rec[taskId] = { steps: {}, done: false, stars: 0, by: 'parent' };
    rec[taskId].done = true;
    rec[taskId].by = 'parent';
    rec[taskId].stars = t ? Math.max(1, Math.round(t.stars / 2)) : 1;
    // 標記所有步驟為已完成
    if (t) t.steps.forEach(function (st) { rec[taskId].steps[st.id] = rec[taskId].steps[st.id] || Date.now(); });
    s.starsLedger.push({
      childId: s.activeChildId, delta: rec[taskId].stars,
      reason: (t ? t.title.yue : taskId) + '（家長補完成）', date: key, ts: Date.now()
    });
    save();
    return rec[taskId];
  }

  function resetTask(taskId) {
    var s = load();
    var key = todayKey();
    delete dayRecord(key)[taskId];
    save();
  }

  function addHelp(stepId) {
    var s = load();
    s.helpCounts[stepId] = (s.helpCounts[stepId] || 0) + 1;
    saveSoon();
  }

  /* ---------- 星星 ---------- */
  function totalStars(childId) {
    var s = load();
    return s.starsLedger.reduce(function (n, e) {
      if (childId && e.childId && e.childId !== childId) return n;
      return n + (e.delta || 0);
    }, 0);
  }

  /* ---------- 成長地圖 ---------- */
  var MAP_STOPS = [
    { name: { yue: '屋企', zh: '家', en: 'Home' }, icon: '🏠' },
    { name: { yue: '樓下公園', zh: '楼下公园', en: 'Playground' }, icon: '🛝' },
    { name: { yue: '麵包店', zh: '面包店', en: 'Bakery' }, icon: '🥐' },
    { name: { yue: '巴士站', zh: '巴士站', en: 'Bus Stop' }, icon: '🚌' },
    { name: { yue: '圖書館', zh: '图书馆', en: 'Library' }, icon: '📚' },
    { name: { yue: '泳池', zh: '游泳池', en: 'Pool' }, icon: '🏊' },
    { name: { yue: '動物園', zh: '动物园', en: 'Zoo' }, icon: '🦁' },
    { name: { yue: '學校', zh: '学校', en: 'School' }, icon: '🏫' },
    { name: { yue: '劍擊館', zh: '击剑馆', en: 'Fencing Hall' }, icon: '🤺' },
    { name: { yue: '星星山', zh: '星星山', en: 'Star Hill' }, icon: '🌟' }
  ];

  function mapProgress() {
    var s = load();
    // 完成 7 個任務解鎖一格（只計小朋友自己完成嘅）
    var done = 0;
    Object.keys(s.completions).forEach(function (d) {
      Object.keys(s.completions[d]).forEach(function (tid) {
        if (s.completions[d][tid].done) done++;
      });
    });
    var unlocked = Math.min(MAP_STOPS.length, Math.floor(done / 7) + 1);
    return { doneCount: done, unlocked: unlocked, remaining: Math.max(0, 7 - (done % 7)) };
  }

  /* ---------- 週報告 ---------- */
  function weekReport() {
    var s = load();
    var days = [];
    for (var i = 6; i >= 0; i--) {
      var key = dateKeyOffset(-i);
      var rec = s.completions[key] || {};
      var dow = new Date(key + 'T00:00:00').getDay();
      var scheduled = s.tasks.filter(function (t) {
        if (!t.enabled) return false;
        var sc = s.schedule[t.id];
        return sc ? sc.days.indexOf(dow) !== -1 : true;
      });
      var doneIds = Object.keys(rec).filter(function (k) { return rec[k].done; });
      days.push({
        date: key,
        dow: dow,
        scheduled: scheduled.length,
        done: doneIds.length,
        rate: scheduled.length ? doneIds.length / scheduled.length : 0
      });
    }
    // 卡點分析
    var stuck = Object.keys(s.helpCounts).map(function (sid) {
      var tid = sid.replace(/-\d+$/, '');
      var t = taskById(tid);
      var st = t ? t.steps.find(function (x) { return x.id === sid; }) : null;
      return { stepId: sid, count: s.helpCounts[sid], taskTitle: t ? t.title.yue : tid, text: st ? st.yue : sid };
    }).filter(function (x) { return x.count > 0; }).sort(function (a, b) { return b.count - a.count; });

    // 最常未完成嘅任務
    var missCount = {};
    days.forEach(function (d) {
      var rec = s.completions[d.date] || {};
      var dow = d.dow;
      s.tasks.forEach(function (t) {
        if (!t.enabled) return;
        var sc = s.schedule[t.id];
        if (sc && sc.days.indexOf(dow) === -1) return;
        if (!(rec[t.id] && rec[t.id].done)) missCount[t.id] = (missCount[t.id] || 0) + 1;
      });
    });
    var missed = Object.keys(missCount).map(function (tid) {
      var t = taskById(tid);
      return { taskId: tid, title: t ? t.title.yue : tid, icon: t ? t.icon : '📌', count: missCount[tid] };
    }).sort(function (a, b) { return b.count - a.count; });

    var totalScheduled = days.reduce(function (n, d) { return n + d.scheduled; }, 0);
    var totalDone = days.reduce(function (n, d) { return n + d.done; }, 0);
    return {
      days: days,
      stuck: stuck.slice(0, 5),
      missed: missed.slice(0, 5),
      rate: totalScheduled ? totalDone / totalScheduled : 0,
      totalDone: totalDone,
      totalScheduled: totalScheduled
    };
  }

  /* ---------- 圖鑑 ---------- */
  function stickerBook() {
    var s = load();
    var everDone = {};
    Object.keys(s.completions).forEach(function (d) {
      Object.keys(s.completions[d]).forEach(function (tid) {
        if (s.completions[d][tid].done) everDone[tid] = true;
      });
    });
    return s.tasks.map(function (t) {
      return { task: t, unlocked: !!everDone[t.id] };
    });
  }

  /* ---------- 匯出 / 匯入 ---------- */
  function exportJSON() {
    return JSON.stringify(load(), null, 2);
  }

  function importJSON(text) {
    try {
      var obj = JSON.parse(text);
      if (!obj || !obj.tasks) throw new Error('格式唔啱');
      state = obj;
      save();
      return true;
    } catch (e) {
      return false;
    }
  }

  function resetAll() {
    localStorage.removeItem(KEY);
    state = null;
    load();
  }

  global.SBS_STORE = {
    KEY: KEY,
    AVATARS: AVATARS,
    SCARVES: SCARVES,
    MAP_STOPS: MAP_STOPS,
    todayKey: todayKey,
    dateKeyOffset: dateKeyOffset,
    uid: uid,
    load: load,
    save: save,
    saveSoon: saveSoon,
    children: children,
    activeChild: activeChild,
    addChild: addChild,
    updateChild: updateChild,
    removeChild: removeChild,
    tasks: tasks,
    taskById: taskById,
    schedule: schedule,
    todayTasks: todayTasks,
    taskProgress: taskProgress,
    completeStep: completeStep,
    uncompleteStep: uncompleteStep,
    finishTask: finishTask,
    parentCompleteTask: parentCompleteTask,
    resetTask: resetTask,
    addHelp: addHelp,
    totalStars: totalStars,
    mapProgress: mapProgress,
    weekReport: weekReport,
    stickerBook: stickerBook,
    exportJSON: exportJSON,
    importJSON: importJSON,
    resetAll: resetAll
  };
})(window);
