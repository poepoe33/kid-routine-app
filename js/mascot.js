/* ============================================================
   「一步一步」— 吉祥物 Gin（金棕長毛貓）與圖示元件
   ============================================================ */
(function (global) {
  'use strict';

  var FUR = '#D9A066';
  var FUR_DARK = '#C98A4B';
  var FUR_LIGHT = '#F5DFC0';
  var EYE = '#3FA34D';
  var PINK = '#F2B8A8';
  var LINE = '#B4794A';

  /**
   * Gin 吉祥物 SVG
   * opts: { scarf:'#1F9E94', mood:'happy'|'sleep'|'wave'|'cheer', size:200, anim:'wave'|'jump'|'spin'|'sleep'|null }
   */
  function gin(opts) {
    opts = opts || {};
    var scarf = opts.scarf || '#1F9E94';
    var size = opts.size || 200;
    var anim = opts.anim || '';
    var mood = opts.mood || 'happy';
    var eyesOpen = mood !== 'sleep';

    var eyes = eyesOpen
      ? '<ellipse cx="100" cy="99" rx="15" ry="17" fill="#fff"/>' +
        '<ellipse cx="140" cy="99" rx="15" ry="17" fill="#fff"/>' +
        '<circle cx="101" cy="101" r="9.5" fill="' + EYE + '"/>' +
        '<circle cx="139" cy="101" r="9.5" fill="' + EYE + '"/>' +
        '<circle cx="97.5" cy="96.5" r="3.4" fill="#fff"/>' +
        '<circle cx="135.5" cy="96.5" r="3.4" fill="#fff"/>'
      : '<path d="M86 100 q14 10 28 0" stroke="' + LINE + '" stroke-width="4" fill="none" stroke-linecap="round"/>' +
        '<path d="M126 100 q14 10 28 0" stroke="' + LINE + '" stroke-width="4" fill="none" stroke-linecap="round"/>' +
        '<text x="150" y="76" font-size="20" fill="' + LINE + '">z</text>';

    var wavePaw = anim === 'wave'
      ? '<g class="gin-paw-wave"><ellipse cx="190" cy="150" rx="18" ry="14" fill="' + FUR_LIGHT + '"/>' +
        '<circle cx="190" cy="150" r="9" fill="' + PINK + '"/></g>'
      : '';

    var mouth = mood === 'cheer'
      ? '<path d="M108 122 q12 16 24 0 q-12 8 -24 0z" fill="#E8836F" stroke="' + LINE + '" stroke-width="2"/>'
      : '<path d="M120 126 q-6 8 -12 2" stroke="' + LINE + '" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '<path d="M120 126 q6 8 12 2" stroke="' + LINE + '" stroke-width="3" fill="none" stroke-linecap="round"/>';

    return '' +
      '<svg class="gin gin-' + anim + '" width="' + size + '" height="' + size + '" viewBox="0 0 240 240" ' +
      'xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Gin 貓貓">' +
      /* 地面陰影 */
      '<ellipse cx="120" cy="218" rx="64" ry="10" fill="#000" opacity="0.07"/>' +
      /* 尾巴 */
      '<path class="gin-tail" d="M172 198 q42 6 38 -34 q-2 -24 -24 -14" stroke="' + FUR_DARK + '" stroke-width="20" fill="none" stroke-linecap="round"/>' +
      /* 身體 */
      '<ellipse cx="120" cy="172" rx="56" ry="48" fill="' + FUR + '"/>' +
      /* 長毛 - 身體兩側 */
      '<path d="M64 172 q-12 10 -4 20 q5 7 12 1z" fill="' + FUR_DARK + '"/>' +
      '<path d="M176 172 q12 10 4 20 q-5 7 -12 1z" fill="' + FUR_DARK + '"/>' +
      '<path d="M78 206 q-8 10 0 18 q6 6 12 -2z" fill="' + FUR_DARK + '"/>' +
      '<path d="M162 206 q8 10 0 18 q-6 6 -12 -2z" fill="' + FUR_DARK + '"/>' +
      /* 肚腩 */
      '<ellipse cx="120" cy="184" rx="34" ry="32" fill="' + FUR_LIGHT + '"/>' +
      /* 前爪 */
      '<ellipse cx="94" cy="210" rx="16" ry="11" fill="' + FUR_LIGHT + '"/>' +
      '<ellipse cx="146" cy="210" rx="16" ry="11" fill="' + FUR_LIGHT + '"/>' +
      wavePaw +
      /* 耳朵 */
      '<path d="M78 62 L62 20 L110 46 Z" fill="' + FUR + '"/>' +
      '<path d="M162 62 L178 20 L130 46 Z" fill="' + FUR + '"/>' +
      '<path d="M80 58 L71 33 L99 47 Z" fill="' + PINK + '"/>' +
      '<path d="M160 58 L169 33 L141 47 Z" fill="' + PINK + '"/>' +
      /* 頭 */
      '<circle cx="120" cy="100" r="54" fill="' + FUR + '"/>' +
      /* 頭頂長毛 */
      '<path d="M92 50 q-14 -14 -4 -22 q8 -6 16 6z" fill="' + FUR_DARK + '"/>' +
      '<path d="M120 44 q0 -18 10 -18 q8 2 2 20z" fill="' + FUR_DARK + '"/>' +
      '<path d="M148 50 q14 -14 4 -22 q-8 -6 -16 6z" fill="' + FUR_DARK + '"/>' +
      /* 面颊絨毛 */
      '<path d="M68 108 q-14 6 -10 16 q3 8 12 2z" fill="' + FUR_DARK + '"/>' +
      '<path d="M172 108 q14 6 10 16 q-3 8 -12 2z" fill="' + FUR_DARK + '"/>' +
      /* 眼 */
      eyes +
      /* 鼻 */
      '<path d="M113 116 q7 -7 14 0 q-7 7 -14 0z" fill="#E8836F"/>' +
      /* 嘴 */
      mouth +
      /* 鬍鬚 */
      '<g stroke="' + LINE + '" stroke-width="2.4" stroke-linecap="round" opacity="0.75">' +
      '<path d="M76 110 L42 102"/><path d="M76 119 L42 121"/>' +
      '<path d="M164 110 L198 102"/><path d="M164 119 L198 121"/>' +
      '</g>' +
      /* 頸巾 */
      '<path d="M76 140 q44 20 88 0 q5 20 -6 29 q-38 17 -76 0 q-11 -9 -6 -29z" fill="' + scarf + '"/>' +
      '<path d="M152 164 q20 16 9 36 q-9 13 -20 4 q-7 -20 11 -40z" fill="' + scarf + '" opacity="0.78"/>' +
      '<path d="M76 140 q44 20 88 0" stroke="rgba(255,255,255,.35)" stroke-width="3" fill="none"/>' +
      '</svg>';
  }

  /* 星星罐：fill = 0..1 */
  function starJar(fill) {
    var f = Math.max(0, Math.min(1, fill || 0));
    var top = 96 - 62 * f; // 水位
    return '' +
      '<svg viewBox="0 0 140 170" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-label="星星罐">' +
      '<defs><clipPath id="jarClip"><path d="M28 30 h84 v18 l10 14 v84 a12 12 0 0 1 -12 12 h-80 a12 12 0 0 1 -12 -12 v-84 l10 -14 z"/></clipPath></defs>' +
      /* 玻璃 */
      '<path d="M28 30 h84 v18 l10 14 v84 a12 12 0 0 1 -12 12 h-80 a12 12 0 0 1 -12 -12 v-84 l10 -14 z" fill="#fff" stroke="#1F9E94" stroke-width="4"/>' +
      /* 水位 */
      '<g clip-path="url(#jarClip)"><rect x="18" y="' + top + '" width="104" height="90" fill="#FFD98A"/>' +
      '<path d="M18 ' + top + ' q13 -7 26 0 t26 0 t26 0 t26 0 v12 h-104z" fill="#FFC85E"/></g>' +
      /* 星星 */
      '<g fill="#F07A1F">' +
      '<path d="M46 96 l4 9 10 1 -7 7 2 10 -9 -5 -9 5 2 -10 -7 -7 10 -1z"/>' +
      '<path d="M76 118 l4 9 10 1 -7 7 2 10 -9 -5 -9 5 2 -10 -7 -7 10 -1z"/>' +
      '<path d="M58 132 l3 7 8 1 -6 6 2 8 -7 -4 -7 4 2 -8 -6 -6 8 -1z"/>' +
      '</g>' +
      /* 高光 */
      '<path d="M40 52 v96" stroke="rgba(255,255,255,.85)" stroke-width="6" stroke-linecap="round"/>' +
      /* 蓋 */
      '<rect x="22" y="20" width="96" height="14" rx="7" fill="#F07A1F"/>' +
      '</svg>';
  }

  function star(size, color) {
    var s = size || 24;
    var c = color || '#F07A1F';
    return '<svg viewBox="0 0 24 24" width="' + s + '" height="' + s + '" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M12 2 l2.9 6.3 6.9 .8 -5.1 4.7 1.4 6.8 -6.1 -3.5 -6.1 3.5 1.4 -6.8 -5.1 -4.7 6.9 -.8z" fill="' + c + '"/></svg>';
  }

  function check(size, color) {
    var s = size || 24;
    var c = color || '#1F9E94';
    return '<svg viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<circle cx="12" cy="12" r="11" fill="' + c + '"/>' +
      '<path d="M6.5 12.5 l3.6 3.6 L17.5 8.6" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  /* 成長地圖：stops 數量、已解鎖數量 */
  function mapPath(unlocked) {
    var stops = global.SBS_STORE.MAP_STOPS;
    var W = 700, H = 190;
    var step = W / (stops.length + 1);
    var pts = stops.map(function (_, i) {
      var x = step * (i + 1);
      var y = 130 - (i % 3) * 26;
      return { x: x, y: y };
    });
    var d = 'M' + pts[0].x + ' ' + pts[0].y;
    for (var i = 1; i < pts.length; i++) {
      var px = pts[i - 1], cu = pts[i];
      var mx = (px.x + cu.x) / 2;
      var my = Math.min(px.y, cu.y) - 30;
      d += ' Q' + mx + ' ' + my + ' ' + cu.x + ' ' + cu.y;
    }
    var dots = pts.map(function (p, i) {
      var on = i < unlocked;
      var s = stops[i];
      return '<g class="map-stop ' + (on ? 'on' : 'off') + '">' +
        '<circle cx="' + p.x + '" cy="' + p.y + '" r="' + (on ? 26 : 20) + '" fill="' + (on ? '#1F9E94' : '#E4DDD2') + '"/>' +
        '<text x="' + p.x + '" y="' + (p.y + 8) + '" font-size="' + (on ? 24 : 18) + '" text-anchor="middle">' + s.icon + '</text>' +
        '<text x="' + p.x + '" y="' + (p.y + 46) + '" font-size="14" text-anchor="middle" fill="' + (on ? '#2B2B2B' : '#A9A29A') + '">' + s.name.yue + '</text>' +
        '</g>';
    }).join('');

    return '<svg viewBox="0 0 ' + W + ' ' + (H + 20) + '" width="100%" xmlns="http://www.w3.org/2000/svg" aria-label="成長地圖">' +
      '<path d="' + d + '" stroke="#D6CEC2" stroke-width="6" fill="none" stroke-dasharray="10 10" stroke-linecap="round"/>' +
      '<path d="' + d + '" stroke="#1F9E94" stroke-width="6" fill="none" stroke-linecap="round" ' +
      'stroke-dasharray="2000" stroke-dashoffset="' + (2000 * (1 - unlocked / stops.length)) + '" opacity=".85"/>' +
      dots +
      '</svg>';
  }

  global.SBS_MASCOT = {
    gin: gin,
    starJar: starJar,
    star: star,
    check: check,
    mapPath: mapPath,
    COLORS: { FUR: FUR, FUR_DARK: FUR_DARK, FUR_LIGHT: FUR_LIGHT, EYE: EYE, PINK: PINK, LINE: LINE }
  };
})(window);
