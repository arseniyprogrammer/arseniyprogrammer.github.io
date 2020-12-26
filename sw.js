const CACHE = "magic-ball";

// При установке воркера мы должны закешировать часть данных (статику).
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) =>
        cache.addAll([
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
          "./system/manifest.webmanifest",
          ""
        ])
      )
  );
});

// При запросе на сервер мы используем данные из кэша и только после идем на сервер.
self.addEventListener("fetch", (event) => {
  // Как и в предыдущем примере, сначала `respondWith()` потом `waitUntil()`
  event.respondWith(fromCache(event.request));
  event.waitUntil(
    update(event.request)
      // В конце, после получения "свежих" данных от сервера уведомляем всех клиентов.
      .then(refresh)
  );
});

function fromCache(request) {
  return caches
    .open(CACHE)
    .then((cache) =>
      cache
        .match(request)
        .then((matching) => matching || Promise.reject("no-match"))
    );
}

function update(request) {
  return caches
    .open(CACHE)
    .then((cache) =>
      fetch(request).then((response) =>
        cache.put(request, response.clone()).then(() => response)
      )
    );
}

// Шлём сообщения об обновлении данных всем клиентам.
function refresh(response) {
  return self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      // Подробнее про ETag можно прочитать тут
      // https://en.wikipedia.org/wiki/HTTP_ETag
      const message = {
        type: "refresh",
        url: response.url,
        eTag: response.headers.get("ETag"),
      };
      // Уведомляем клиент об обновлении данных.
      client.postMessage(JSON.stringify(message));
    });
  });
}

/*var CACHE_NAME = "magic-ball";
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
});*/
