/* Firebase Cloud Messaging service worker for Yalla Kora.
 * Deploy this file at the root of the same HTTPS origin as index.html.
 */
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

firebase.initializeApp({
  apiKey: 'AIzaSyASo8wCgN6vDvjojcU40DXKJEfnW42uKFY',
  authDomain: 'yalla-kora-9ec86.firebaseapp.com',
  databaseURL: 'https://yalla-kora-9ec86-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'yalla-kora-9ec86',
  storageBucket: 'yalla-kora-9ec86.firebasestorage.app',
  messagingSenderId: '436550928755',
  appId: '1:436550928755:web:ebcebb517b87a2b021dd06'
});

const messaging = firebase.messaging();

// Data-only messages need this handler to create a visible notification.
messaging.setBackgroundMessageHandler(function (payload) {
  const data = payload && payload.data ? payload.data : {};
  const notificationTitle = data.title || 'يلا كورة';
  const notificationOptions = {
    body: data.body || 'لديك تنبيه جديد عن المباريات.',
    icon: data.icon || './icon-192.png',
    data: { url: data.url || './' },
    tag: data.tag || 'yalla-kora-match-alert'
  };
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || './';
  event.waitUntil((async function () {
    const windows = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of windows) {
      if ('focus' in client) {
        await client.focus();
        if ('navigate' in client) await client.navigate(targetUrl);
        return;
      }
    }
    if (clients.openWindow) return clients.openWindow(targetUrl);
  })());
});
