// هذا ملف العامل الخدمي service-worker.js المبسط
// تم حذف منطق التخزين المؤقت لضمان أن تظهر الخصومات والتحديثات فوراً.

self.addEventListener('install', (evt) => {
  // تخطي حالة الانتظار لتفعيل العامل الخدمي فوراً
  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  // السيطرة على العميل فوراً
  self.clients.claim();
  // التأكد من مسح أي كاش قديم (هذا مهم جداً لضمان عدم وجود نسخ قديمة من script.js)
  evt.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    )
  );
});

// تم حذف حدث 'fetch' بالكامل. 
// هذا يضمن أن المتصفح سيذهب للشبكة في كل مرة لجلب البيانات الجديدة (script.js)، مما يعرض الخصومات فوراً.
