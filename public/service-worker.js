const APP_PREFIX = "Budget Tracker";
const CACHE_NAME = `${APP_PREFIX}-cache-v1`;

const filesToCache = [
    "index.html",
    "./styles/styles.css",
    "./js/index.js",
    "./js/idb.js",
    "./manifest.webmanifest",
    "./icons/icon-512x512.png",
    "./icons/icon-384x384.png",
    "./icons/icon-192x192.png",
    "./icons/icon-152x152.png",
    "./icons/icon-144x144.png",
    "./icons/icon-128x128.png",
    "./icons/icon-96x96.png",
    "./icons/icon-72x72.png",
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener("activate", (event) => {
    if (evt.request.url.includes("/api/")) {
        evt.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
                return fetch(evt.request)
                    .then((response) => {
                        cache.put(evt.request, response.clone());
                        return response;
                    })
                    .catch((err) => {
                        return cache.match(evt.request);
                    });
            })
        ).catch((err) => {
            console.log(err);
        });
        return;
    }
    evt.respondWith(
        fetch(evt.request).then((response) => {
            if (response) {
                return response;
            }
        })
    );
});
