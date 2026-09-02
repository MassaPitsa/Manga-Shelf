// Service worker mínimo: solo existe para que el navegador (sobre todo
// Android/Chrome) considere la app "instalable" como PWA y para poder abrirla
// una vez ya visitada aunque no haya conexión en ese momento. Estrategia
// "network-first": si hay internet, siempre se usa la versión más reciente;
// si no hay conexión, se sirve la última copia que se guardó en caché.
const CACHE = 'biblioteca-manga-shell-v1';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, copy)).catch(() => {});
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
