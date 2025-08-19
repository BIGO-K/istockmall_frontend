import { precacheAndRoute } from 'workbox-precaching'
declare let self: ServiceWorkerGlobalScope
self.__WB_DISABLE_DEV_LOGS = true

precacheAndRoute(self.__WB_MANIFEST)

const CACHE_VERSION = `V_1`;
const CACHE_NAME = `static${CACHE_VERSION}`
const CACHE_ITEMS = [
    '/src/assets/font/PretendardVariable.woff2',    
]


self.addEventListener('install', (event) => {
    // console.log(CACHE_NAME + '.....INSTALLING')
    // cache a cat SVG
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            cache.addAll(CACHE_ITEMS);
            return cache;
        }),
    )
})

// self.addEventListener('fetch', function (event) {
//     event.respondWith(
//         caches.match(event.request).then(function (response) {
//             // Cache hit - return response
//             if (response) {              
//                 return response
//             } 
//             return fetch(event.request)
//         }),
//     )
// })

// /**
//  * 이전 캐시 삭제 처리 
//  */
self.addEventListener("activate", (event) => {
    // 영구적으로 가져갈 캐시 스트리지 화이트리스트
    event.waitUntil(
        // 캐시 스토리지의 모든 스토리지명을 가져온다.
        caches.keys().then((cacheNames) => {
        // 캐시를 삭제하는 건 Promise를 반환하므로 Promise.all을 사용해 끝날 시점을 잡아야한다.
            return Promise.all(
                // 이 결과는 [Promise, Promise...] 형태가 되시겠다.
                cacheNames.map((cacheName) => {
                    // 각각의 캐시 스토리지명이 화이트 리스트와 같지 않을 경우
                    if (cacheName !== CACHE_NAME) {
                        // 캐시를 삭제하는 Promise를 배열에 추가한다.
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // activate 시에는 clients claim 메소드를 호출해서
    // 브라우저에 대한 제어권을 가져와야한다.
    return self.clients.claim();
});