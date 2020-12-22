if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../index.html', {scope: './'})
    .then((reg) => {
      console.log('Registration succeeded. Scope is ' + reg.scope);
    }).catch((error) => {
      console.log('Registration succeeded. Scope is ' + reg.scope);
    });
  }
  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('v1').then((cache) => {
        return cache.addAll([
          '../index.html',
          '../system/manifest.webmanifest',
          '../system/service-worker.js',
          '../style/style.css',
          '../images/magicBall.png',
          '../icons/ball-16.png',
          '../icons/ball-32.png',
          '../icons/ball-48.png',
          '../icons/ball-72.png',
          '../icons/ball-96.png',
          '../icons/ball-144.png',
          '../icons/ball-192.png',
          '../icons/ball-512.png',
        ]);
      })
    );
  });