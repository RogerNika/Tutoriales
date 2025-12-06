// ***** VERSIONA LA CACHÉ CADA VEZ QUE CAMBIES LA APP *****
const CACHE_NAME = 'app-cache-v2';

// Archivos que se van a cachear (todas las páginas y recursos principales)
const ASSETS = [
  '/Tutoriales/',
  '/Tutoriales/index.html',
  '/Tutoriales/bienvenida.html',
  '/Tutoriales/sensores.html',
  '/Tutoriales/servicios.html',
  '/Tutoriales/librerias.html',
  '/Tutoriales/seguridad.html',
  '/Tutoriales/despliegue.html',
  '/Tutoriales/distribucion.html',
  '/Tutoriales/referencias.html',

  // nuevos temas
  '/Tutoriales/sistemas.html',
  '/Tutoriales/nativas.html',
  '/Tutoriales/hardware.html',
  '/Tutoriales/lenguajes.html',
  '/Tutoriales/entornos.html',
  '/Tutoriales/interfaces.html',
  '/Tutoriales/guias.html',
  '/Tutoriales/arquitecturas.html',
  '/Tutoriales/versiones.html',
  '/Tutoriales/persistencia.html',

  '/Tutoriales/styles.css',
  '/Tutoriales/app.js',
  '/Tutoriales/auth.js',
  '/Tutoriales/firebase.js',
  '/Tutoriales/manifest.webmanifest',
  '/Tutoriales/192192.png',
  '/Tutoriales/favicon_berty--android-chrome-512x512.png'
];

// Instalación: guarda los recursos en caché
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activación: limpia cachés viejos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: cache-first con fallback a red y a bienvenida.html para navegación
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          // Si la respuesta es válida, actualiza caché en segundo plano
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            event.request.url.startsWith(self.location.origin)
          ) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Si falla la red y es navegación, manda a bienvenida
          if (event.request.mode === 'navigate') {
            return caches.match('/Tutoriales/bienvenida.html');
          }
          // Si falla y había caché, usa caché
          return cached;
        });

      // Primero intenta caché, si no, usa red
      return cached || fetchPromise;
    })
  );
});




