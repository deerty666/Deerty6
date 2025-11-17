const CACHE_NAME = "deerty6-v2";
const FILES = [
    "./",
    "./index.html",
    "./style.css",
    "./app.js",
    "./manifest.json",
    "./icons/icon-192.png",
    "./icons/icon-512.png"
];

self.addEventListener("install", e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(FILES))
    );
});

self.addEventListener("activate", e => {
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(k => k !== CACHE_NAME && caches.delete(k))
            );
        })
    );
});

self.addEventListener("fetch", e => {
    e.respondWith(
        caches.match(e.request).then(res => res || fetch(e.request))
    );
});
