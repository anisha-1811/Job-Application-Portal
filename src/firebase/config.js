import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔴 REPLACE THESE with your real Firebase project values.
// Firebase Console → Project Settings → Your apps → SDK setup & configuration
const firebaseConfig = {
  apiKey: "AIzaSyXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456:web:abc123"
};

// Safe initialization — exports always exist even if config is invalid
let auth = null;
let googleProvider = null;
let db = null;

try {
  const app = getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApps()[0];

  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  db = getFirestore(app);
} catch (e) {
  console.error("Firebase init failed. Check your config in firebase/config.js:", e.message);
}

export { auth, googleProvider, db };