const cacheName = 'c1';
const resourcesToPrecache = [
    './',
    'index.html',
    'style.css',
    'js/script.js',
    'js/html5-qrcode.min.js',
    'js/data.json',
]
function addAllPrecache(event){
    event.waitUntil(
        caches.open(cacheName)
        .then(cache => cache.addAll(resourcesToPrecache))
        .catch(err => {console.log('no network');})
    )
}

self.addEventListener('install', addAllPrecache);
self.addEventListener('activate', event => {
    console.log('Activate Event');
})
self.addEventListener('fetch', event => {
    console.log(event.request.url);
    event.respondWith(
        caches.match(event.request).then(res =>{
            return res || fetch(event.request);
        })
        
    )
})