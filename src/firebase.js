// Import Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your Firebase config (from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyBeELQTWrq4Vx062aZAcbsDisGm_3DjGy0",
  authDomain: "connect-us-21037.firebaseapp.com",
  projectId: "connect-us-21037",
  storageBucket: "connect-us-21037.firebasestorage.app",
  messagingSenderId: "745570841104",
  appId: "1:745570841104:web:b84c1d1dea79f23a251095"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const db = getFirestore(app);
export const auth = getAuth(app);