const CACHE_NAME = 'sfit-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/logo-192.png',
  '/logo-512.png',
  '/logo.png',
  '/maskable-192.png',
  '/maskable-512.png',
  '/screenshot-desktop.png',
  '/screenshot-mobile.png',
  '/privacy.html',
  '/robots.txt'
];

// Install Event - Pre-cache essential offline assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching app shell assets');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Stale-While-Revalidate pattern with offline navigation fallback
self.addEventListener('fetch', (event) => {
  // Only handle HTTP/HTTPS requests (ignore browser extensions, chrome-extension:// etc.)
  if (!event.request.url.startsWith(self.location.origin) && !event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch a fresh version in the background to update the cache asynchronously
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
            }
          })
          .catch(() => { /* ignore background sync errors */ });
        return cachedResponse;
      }

      // If not in cache, fallback to network
      return fetch(event.request)
        .then((networkResponse) => {
          // Cache newly fetched basic static assets
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // SPA offline navigation fallback: if network fails and page is navigated, return index.html
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
    })
  );
});
