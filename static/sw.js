const CACHE_NAME = `Cloud-drive-v1`;

// Use the install event to pre-cache all initial resources.
self.addEventListener('install', event => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);
        cache.addAll([
            'http://10.107.115.212:4000/resource/app/script.js',
            'http://10.107.115.212:4000/resource/app/style.css',
            'http://10.107.115.212:4000/resource/login/style.css',
            'http://10.107.115.212:4000/resource/login/script.js',
        ]);
    })());
});

self.addEventListener('fetch', event => {
    console.log(event.request)
    event.respondWith((async () => {
        const cache = await caches.open(CACHE_NAME);
        // Get the resource from the cache.
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
            return cachedResponse;
        } else {
            try {
                // If the resource was not in the cache, try the network.
                const fetchResponse = await fetch(event.request);

                // Save the resource in the cache and return it.
                cache.put(event.request, fetchResponse.clone());
                return fetchResponse;
            } catch (e) {
                // The network failed.
            }
        }
    })());
});