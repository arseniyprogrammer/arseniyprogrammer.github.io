var CACHE_NAME = "magic-ball";
var urlsToCache = [
  "./index.html",
  "./media/icons/ball-16.png",
  "./media/icons/ball-32.png",
  "./media/icons/ball-48.png",
  "./media/icons/ball-72.png",
  "./media/icons/ball-96.png",
  "./media/icons/ball-144.png",
  "./media/icons/ball-192.png",
  "./media/icons/ball-512.png",
  "./media/images/magicBall.webp",
  "./style/style.css",
  "./system/app.js",
  "./system/manifest.webmanifest"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response) {
        return response;
      }

      return fetch(event.request).then(function (response) {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        var responseToCache = response.clone();

        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});

self.addEventListener("activate", function (event) {
  var cacheAllowlist = ["magic-ball"];

  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheAllowlist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});