self.addEventListener('install', (e) => {
    // Force l'installation immédiate du SW
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    // Nettoyage des anciens caches si nécessaire
    e.waitUntil(clients.claim());
});

self.addEventListener('fetch', (e) => {
    // Stratégie basique : on tente le réseau, sinon on regarde le cache (s'il y en avait un).
    // Ici on fait juste un pass-through réseau.
    e.respondWith(fetch(e.request).catch(() => {
        // En cas d'échec (hors ligne) on pourrait retourner une page par défaut
    }));
});
