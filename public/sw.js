const CACHE_NAME = 'barak-prayer-app-v1';

// ইনস্টল হওয়ার সময় প্রয়োজনীয় ফাইল ক্যাশ বা সেভ করা
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html'
      ]);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// ইন্টারনেট না থাকলে ফোন মেমোরি (Cache) থেকে ফাইল লোড করবে
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // নতুন ডেটা ক্যাশে সেভ করে নেওয়া
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // ইন্টারনেট অফ থাকলে ক্যাশ ফাইল থেকে দেখাবে
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return caches.match('/');
        });
      })
  );
});
