// // Import the functions you need from the SDKs you need
// initialized Firebase SDK in the frontend
// getMessaging() is imported and initialized.
// You registered the service worker (firebase-messaging-sw.js) manually.
// messaging, getToken, and onMessage are exported to be used for notification permission and token generation.
// ✅ Purpose: Prepare the frontend to receive notifications and get device FCM tokens
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
import { deleteToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};
// // Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);
// Explicitly register the service worker
if ('serviceWorker' in navigator) {
  console.log("At firebase.js file")
  navigator.serviceWorker
    .register('/firebase-messaging-sw.js')
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch((err) => {
      console.log('Service Worker registration failed:', err);
    });
}


 
export {app , analytics  };
export{messaging, getToken, onMessage , deleteToken}

//this will be used for google , facebook etc login-------->
export const auth = getAuth(app)
export const db = getFirestore()