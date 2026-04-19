import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "job-portal-a4e65.firebaseapp.com",
  projectId: "job-portal-a4e65",
  storageBucket: "job-portal-a4e65.firebasestorage.app",
  messagingSenderId: "205939614343",
  appId: "1:205939614343:web:78c097b88828d4b9080e22"
};

const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApps()[0];

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, googleProvider, db };