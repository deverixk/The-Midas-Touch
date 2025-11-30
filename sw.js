const CACHE_NAME = 'midas-cache-v3';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/main.html',
  '/styles_desktop.css',
  '/styles_movil.css',
  '/loader-3d.js',
  '/spotlight.js',
  '/animations.js',
  '/sidebar.js',
  '/productos-carousel.js',
  '/product-3d-viewer.js',
  '/inicio-magnetic.js',
  '/assets/images/logos/Minimalist.png',
  '/assets/images/bg/fondotmt.png',
  '/assets/images/bg/fondotmt%20movil.png' // espacio codificado
];

// INSTALL: pre-cache
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE))
  );
});

// ACTIVATE: limpia caches antiguos y toma control
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k !== CACHE_NAME) ? caches.delete(k) : null))
    ).then(() => self.clients.claim())
  );
});

// FETCH: cache-first con fallback a red y guardado dinámico
self.addEventListener('fetch', event => {
  const req = event.request;

  // Solo manejar GET y mismo origen
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) {
    return;
  }

  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;

      return fetch(req).then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
        }
        return res;
      }).catch(() => {
        const accept = req.headers.get('accept') || '';
        if (accept.includes('text/html')) {
          return caches.match('/main.html');
        }
      });
    })
  );
});
