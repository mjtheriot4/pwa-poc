const cacheName = 'c1';
const resourcesToPrecache = [
    '/',
    'index.html',
    'style.css',
    'script.js'
]
function addAllPrecache(event){
    event.waitUntil(
        caches.open(cacheName)
        .then(cache => cache.addAll(resourcesToPrecache))
    )
}

// self.addEventListener('install', addAllPrecache);
self.addEventListener('activate', event => {
    console.log('Activate Event');
})
self.addEventListener('fetch', event => {
    event.respondWith(
        new Response('hello <b class="a-winner-is-me">world</b>',{
            headers : {
                "Content-Type" : "text/html; charset=UTF-8"
            }
        })
        // fetch(event.request).then(res =>{
        //     if(res.status == 404){
        //         return new Response('Not Found');
        //     }
        //     return res;
        // })
        // .then(res =>{
        //     console.log(res);
        // })
    )
})