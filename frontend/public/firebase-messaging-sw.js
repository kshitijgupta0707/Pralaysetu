// // public/firebase-messaging-sw.js
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
    const { title, body } = payload.notification;
    const notificationOptions = {
        body,
        icon: '/logo.png',
    };

    self.registration.showNotification(title, notificationOptions);
});


// public/firebase-messaging-sw.js (modular SDK version)

// public/firebase-messaging-sw.js

// import { initializeApp } from "firebase/app";
// import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

// const firebaseConfig = {
//   apiKey: "AIzaSyCh93qiDcqEW35oXcHroqAkt5KfqMPZERE",
//   authDomain: "pralaysetu.firebaseapp.com",
//   projectId: "pralaysetu",
//   storageBucket: "pralaysetu.firebasestorage.app",
//   messagingSenderId: "766465592366",
//   appId: "1:766465592366:web:4a8d0703a7c83ebd6ae3bf",
//   measurementId: "G-2V5QTW5L4M"
// };

// const app = initializeApp(firebaseConfig);
// const messaging = getMessaging(app);

// onBackgroundMessage(messaging, (payload) => {
//   console.log('[firebase-messaging-sw.js] Background message received:', payload);

//   const { title, body } = payload.notification;

//   self.registration.showNotification(title, {
//     body,
//     icon: '/logo.png',
//   });
// });
