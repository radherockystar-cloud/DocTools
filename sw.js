const CACHE_NAME = 'doctools-live-v1';

// Instant installation without waiting
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

// Purane saare cache ko turant delete karega
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Network-First Strategy: Pehle internet se naya code layega, offline hone par cache use karega
self.addEventListener('fetch', (e) => {
  if (e.request.url.includes('/api/')) return;

  e.respondWith(
    fetch(e.request)
      .then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, responseToCache);
        });
        return response;
      })
      .catch(() => caches.match(e.request))
  );
});
