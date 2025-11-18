const CACHE_NAME = "midas-cache-v1";

const urlsToCache = [
  "/",
  "/index.html",
  "/main.html",
  "/styles_desktop.css",
  "/styles_movil.css",
  "/loader-3d.js",
  "/spotlight.js",
  "/animations.js",
  "/sidebar.js",
  "/productos-carousel.js",
  "/product-3d-viewer.js",
  "/inicio-magnetic.js",
  "/assets/images/logos/Minimalist.png",
  "/assets/images/bg/fondotmt.png",
  "/assets/images/bg/fondotmt movil.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
