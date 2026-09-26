/* Service worker : garde l'application sur le téléphone pour qu'elle marche
 * sans connexion (à la cave, dans la salle de répète…).
 * - l'application elle-même : mise en cache à l'installation
 * - les polices : mises en cache au premier chargement
 * Changer VERSION à chaque mise à jour pour que les téléphones la récupèrent. */
const VERSION = 'ma-batterie-v6';
const COQUILLE = [
  './', './index.html', './manifest.webmanifest',
  './icons/icone-192.png', './icons/icone-512.png',
  './icons/icone-maskable-512.png', './icons/apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(COQUILLE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(noms => Promise.all(noms.filter(n => n !== VERSION).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // polices Google : la copie en cache sert tout de suite, et se rafraîchit en fond
  if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)){
    e.respondWith(caches.open(VERSION).then(async c => {
      const enCache = await c.match(req);
      const reseau = fetch(req).then(r => { if (r.ok || r.type === 'opaque') c.put(req, r.clone()); return r; })
                               .catch(() => enCache);
      return enCache || reseau;
    }));
    return;
  }

  if (url.origin !== location.origin) return;

  // pages : réseau d'abord (pour recevoir les mises à jour), cache si hors ligne
  if (req.mode === 'navigate'){
    e.respondWith(
      fetch(req).then(r => { caches.open(VERSION).then(c => c.put('./index.html', r.clone())); return r; })
                .catch(() => caches.match('./index.html'))
    );
    return;
  }
  // le reste (icônes, manifest) : cache d'abord
  e.respondWith(caches.match(req).then(r => r || fetch(req)));
});
