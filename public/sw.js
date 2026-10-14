const CACHE = 'travel-experiences-__BUILD_ID__';
const APP_FILES = __PRECACHE_URLS__;
const scope = self.registration.scope;

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(APP_FILES.map((file) => new URL(file, scope).href))));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(Promise.all([
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith('travel-experiences-') && key !== CACHE).map((key) => caches.delete(key)))),
    self.clients.claim(),
  ]));
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || !url.href.startsWith(scope)) return;

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then((response) => {
      if (response.ok) event.waitUntil(caches.open(CACHE).then((cache) => cache.put(request, response.clone())));
      return response;
    }).catch(async () => (await caches.match(request)) || (await caches.match(scope)) || Response.error()));
    return;
  }

  event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => {
    if (response.ok) event.waitUntil(caches.open(CACHE).then((cache) => cache.put(request, response.clone())));
    return response;
  })));
});
