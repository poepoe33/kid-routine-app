/* ============================================================
   「一步一步」— Service Worker（離線可用）
   Cache-first：所有資源預先快取，之後有新版本會背景更新。
   ============================================================ */
var CACHE = 'sbs-v1';
var ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './js/tasks.js',
  './js/store.js',
  './js/speech.js',
  './js/mascot.js',
  './js/app.js',
  './js/kid.js',
  './js/games.js',
  './js/parent.js',
  './assets/icon.svg',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/icon-maskable-512.png',
  './assets/icon-180.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; })
        .map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(function (hit) {
      if (hit) {
        // 背景更新
        fetch(req).then(function (res) {
          if (res && res.ok) {
            caches.open(CACHE).then(function (c) { c.put(req, res.clone()); });
          }
        }).catch(function () { /* 離線，靜默 */ });
        return hit;
      }
      return fetch(req).then(function (res) {
        if (res && res.ok) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () {
        // 離線 fallback 返 index.html（SPA）
        return caches.match('./index.html');
      });
    })
  );
});
