self.addEventListener('install', function(event) {
  if (self.skipWaiting) { self.skipWaiting(); }

  event.waitUntil(
    caches.open('logbook-sw-v1').then(function(cache) {
      return cache.addAll([
        '/logbook/',
        '/logbook/style.css',
        '/logbook/favicon.png',
        '/logbook/script.js',
        '/logbook/fonts/DarkerGrotesque-Bold.woff2',
        '/logbook/fonts/DarkerGrotesque-Medium.woff2',
        '/logbook/fonts/DarkerGrotesque-Regular.woff2'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});