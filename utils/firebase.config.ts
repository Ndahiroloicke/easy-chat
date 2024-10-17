import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyCsAj9VVmA2kB7MzO4yV1DSv6Yuh77JErg",
  authDomain: "launez-54b3a.firebaseapp.com",
  projectId: "launez-54b3a",
  storageBucket: "launez-54b3a.appspot.com",
  messagingSenderId: "881274176774",
  appId: "1:881274176774:web:7bae223e17fd7b7c3f0a87"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
let analytics;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };
