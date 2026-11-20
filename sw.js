/* Shadow Dance service worker.
 * Network first, so a new version shows up on the next visit; the saved copy steps in when
 * the network is gone, too slow (a weak gym signal) or the host is down. Error pages are never saved.
 * The cache name changes with every build, so old copies are cleaned up automatically. */
const CACHE = 'shadow-dance-89e755d5f4';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png'];
const SLOW_MS = 3500;
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  const nav = req.mode === 'navigate';
  const saved = () => caches.match(req).then((r) => r || (nav ? caches.match('./index.html') : undefined));
  const net = fetch(req).then((res) => {
    if (res.ok) {
      const copy = res.clone();
      return caches.open(CACHE).then((c) => c.put(req, copy)).then(() => res, () => res);
    }
    // never save an error page; if the host itself is failing, keep the app running from the saved copy
    return nav && res.status >= 500 ? saved().then((r) => r || res) : res;
  });
  const settled = net.catch(() => saved());
  e.waitUntil(settled.catch(() => {}));
  const slow = new Promise((ok) => setTimeout(ok, SLOW_MS)).then(saved).then((r) => r || settled);
  e.respondWith(Promise.race([settled, slow]).then((r) => r || Response.error()));
});
