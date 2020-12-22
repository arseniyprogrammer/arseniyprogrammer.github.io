self.addEventListener("install", (e) => {
  console.log("[Service Worker] Install");
});
var cacheName = "magic";
var appShellFiles = [
  "./",
  "./index.html",
  "./system/app.js",
  "./system/manifest.webmanifest.js",
  "./system/sw.js",
  "./style/style.css",
  "./media/icons/ball-16.png",
  "./media/icons/ball-32.png",
  "./media/icons/ball-48.png",
  "./media/icons/ball-72.png",
  "./media/icons/ball-96.png",
  "./media/icons/ball-144.png",
  "./media/icons/ball-192.png",
  "./media/icons/ball-512.png",
  "./media/images/magicBall.png",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  "https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2",
  "https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap",
];

var contentToCache = appShellFiles;
self.addEventListener("install", (e) => {
  console.log("[Service Worker] Install");
  e.waitUntil(
    caches.open(cacheName).then((cache) => {
      console.log("[Service Worker] Caching all: app shell and content");
      return cache.addAll(contentToCache);
    })
  );
});
self.addEventListener("fetch", (e) => {
  console.log("[Service Worker] Fetched resource " + e.request.url);
});
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((r) => {
      console.log("[Service Worker] Fetching resource: " + e.request.url);
      return (
        r ||
        fetch(e.request).then((response) => {
          return caches.open(cacheName).then((cache) => {
            console.log(
              "[Service Worker] Caching new resource: " + e.request.url
            );
            cache.put(e.request, response.clone());
            return response;
          });
        })
      );
    })
  );
});