const CACHE_NAME = "VENOM_SW";

const addResourcesToCache = async (resources) => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(resources);
};

self.addEventListener("install", (event) => {
    event.waitUntil(
        addResourcesToCache([
            "/",
            "/index.html",
            "/manifest.json",
            "/version.txt",
            // #region ICONE
            "/favicon.ico",
            "/assets/icons/apple-touch-icon.png",
            "/assets/icons/favicon-16x16.png",
            "/assets/icons/favicon-32x32.png",
            "/assets/icons/icon-48x48.png",
            "/assets/icons/icon-72x72.png",
            "/assets/icons/icon-96x96.png",
            "/assets/icons/icon-128x128.png",
            "/assets/icons/icon-144x144.png",
            "/assets/icons/icon-152x152.png",
            "/assets/icons/icon-192x192.png",
            "/assets/icons/icon-284x284.png",
            "/assets/icons/icon-512x512.png",
            // #endregion
            // #region IMMAGINI
            "/assets/images/dlicon.png",
            // #endregion
            // #region JAVASCRIPT
            "https://cdn.jsdelivr.net/npm/lodash@4.17.15/lodash.min.js",
            "https://unpkg.com/peerjs@1.3.2/dist/peerjs.min.js",
            "https://cdn.jsdelivr.net/npm/localforage@1.10.0/dist/localforage.min.js",
            "/js/hash.js",
            "/js/icons.js",
            "/js/lang.js",
            "/js/main.js",
            "/js/utils.js",
            "/js/player.js",
            "/js/peer.js",
            // #endregion
            // #region API JAVASCRIPT
            "/api/cors.js",
            "/api/youtube.js",
            "/api/ytmusic.js",
            // #endregion
            // #region CSS
            "/style/style.css",
            // #endregion
            // #region FONT
            "https://encore.scdn.co/fonts/CircularSp-Bold-fe1cfc14b7498b187c78fa72fb72d148.woff2",
            "https://encore.scdn.co/fonts/CircularSp-Book-4eaffdf96f4c6f984686e93d5d9cb325.woff2",
            // #endregion
        ])
    );
});

self.addEventListener('fetch', (event) => {
    //event.respondWith(caches.open(CACHE_NAME).then((cache) => {
    //    // Go to the cache first
    //    return caches.match(event.request.url).then((cachedResponse) => {
    //        // Return a cached response if we have one
    //        if (cachedResponse) {
    //            return cachedResponse;
    //        }
    //        // Otherwise, hit the network
    //        return fetch(event.request).then((fetchedResponse) => {
    //            // Return the network response
    //            return fetchedResponse;
    //        });
    //    });
    //}));
    event.respondWith(
        caches.match(event.request).then(function (response) {
            //console.log("SW - " + event.request.url + "\n" + (Boolean(response) ? 'Serving from cache' : 'Fetching from network'))
            return response || fetch(event.request);
        })
    );
});