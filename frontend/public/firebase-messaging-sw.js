// // // public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');
const firebaseConfig = {
    apiKey: "AIzaSyCh93qiDcqEW35oXcHroqAkt5KfqMPZERE",
    authDomain: "pralaysetu.firebaseapp.com",
    projectId: "pralaysetu",
    storageBucket: "pralaysetu.firebasestorage.app",
    messagingSenderId: "766465592366",
    appId: "1:766465592366:web:4a8d0703a7c83ebd6ae3bf",
    measurementId: "G-2V5QTW5L4M"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    const { title, body } = payload.data;

    const notificationOptions = {
        body: body,
        icon: '/logo.png', // your app icon,
        badge: '/logo.png',
        data: {
            url: payload.data?.route || '/', // link to open on click
        },
        actions: [
            { action: 'open_app', title: 'Open App' },
            // { action: 'custom_action', title: 'Do Something' },
        ]
    };

    self.registration.showNotification(title, notificationOptions);
});

// Optional: Handle click to open correct page
self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (clientList) {
            if (clientList.length > 0) {
                // Focus the first tab
                return clientList[0].focus();
            }
            // If no tabs, open new
            return clients.openWindow(event.notification.data.url);
        })
    );
});