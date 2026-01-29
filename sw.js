/* ===========================================================
   🏆 Calculus Platinum Service Worker (Final Offline)
   =========================================================== */

const CACHE_NAME = 'calc-platinum-v4'; // تحديث الإصدار

// قائمة الملفات (تم حذف offline.html منها)
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-v3.png',
  './icon-192-v3.png',

  // --- ملفات الـ CSS المحلية ---
  './assets/fonts/cairo.css',
  './assets/fontawesome/css/all.min.css',

  // --- ملفات الخطوط ---
  './assets/fonts/Cairo-Black.ttf',
  './assets/fonts/Cairo-Bold.ttf',
  './assets/fonts/Cairo-ExtraBold.ttf',
  './assets/fonts/Cairo-ExtraLight.ttf',
  './assets/fonts/Cairo-Light.ttf',
  './assets/fonts/Cairo-Medium.ttf',
  './assets/fonts/Cairo-Regular.ttf',
  './assets/fonts/Cairo-SemiBold.ttf',
  
  // --- ملفات الأيقونات ---
  './assets/fontawesome/webfonts/fa-brands-400.woff2',
  './assets/fontawesome/webfonts/fa-regular-400.woff2',
  './assets/fontawesome/webfonts/fa-solid-900.woff2',
  './assets/fontawesome/webfonts/fa-v4compatibility.woff2'
];

// 1. التثبيت (Install)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 [SW] جاري تخزين الملفات...');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// 2. التفعيل (Activate)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

// 3. الجلب (Fetch)
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // الملف موجود في الكاش؟ اعرضه فوراً
      if (cachedResponse) return cachedResponse;

      // غير موجود؟ حاول جلبه من الشبكة
      return fetch(event.request).then(networkResponse => {
        // تخزين أي ملف جديد يتم جلبه مستقبلاً (اختياري)
        return networkResponse;
      }).catch(() => {
        // إذا فشل النت والملف غير موجود في الكاش
        // بما أننا تطبيق صفحة واحدة، لا نحتاج لصفحة أوفلاين خاصة
        // index.html مخزن بالفعل وسيظهر تلقائياً
      });
    })
  );
});



