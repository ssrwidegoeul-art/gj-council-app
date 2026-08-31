// 최소 서비스 워커: 설치 가능(PWA) 요건 충족 + 아이콘 캐시
const CACHE = 'office-v1';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(clients.claim()); });
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // 데이터 API는 절대 캐시하지 않음 (항상 네트워크)
  if (url.pathname.startsWith('/api/')) return;
  // 아이콘·매니페스트만 캐시, 나머지는 네트워크 우선
  if (/icon-\d+\.png|manifest\.json/.test(url.pathname)) {
    e.respondWith(
      caches.open(CACHE).then(c =>
        c.match(e.request).then(hit => hit || fetch(e.request).then(res => { c.put(e.request, res.clone()); return res; }))
      )
    );
  } else {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
  }
});
