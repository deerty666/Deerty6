Const CACHE_NAME = 'deerty-cache-v1';
const FILES_TO_CACHE = [
  '/Dirty55/',
  '/Dirty55/index.html',
  '/Dirty55/manifest.json',
  '/Dirty55/icon-192.png', // تم التعديل
  '/Dirty55/icon-512.png'  // تم التعديل
];

self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => { if (k !== CACHE_NAME) return caches.delete(k); }))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
  // استراتيجية Network-then-Cache: جلب من الكاش أولاً للملفات الأساسية، ومن الشبكة مع التخزين للصور.
  evt.respondWith(
    caches.match(evt.request).then(responseFromCache => {
      // 1. إذا وجدنا الملف في الكاش: نعيده فوراً.
      if (responseFromCache) {
        return responseFromCache;
      }

      // 2. إذا لم نجده: نذهب للشبكة.
      return fetch(evt.request).then(responseFromNetwork => {
        
        // التحقق من صلاحية الاستجابة قبل التخزين
        if (!responseFromNetwork || responseFromNetwork.status !== 200 || responseFromNetwork.type !== 'basic') {
          return responseFromNetwork;
        }

        // 3. نحفظ الملف في الكاش: نأخذ نسخة (clone) قبل التخزين.
        const responseToCache = responseFromNetwork.clone();

        caches.open(CACHE_NAME).then(cache => {
          cache.put(evt.request, responseToCache);
        });

        // 4. نعيد الاستجابة الأصلية إلى المتصفح.
        return responseFromNetwork;

      }).catch(() => {
        // يمكنك هنا إعادة توجيه المستخدم لصفحة offline.
      });
    })
  );
});