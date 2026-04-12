import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCNy4mHcENyyORaAUGR7u17RC2834IuqNc",
  authDomain: "campus-marketplace-a2265.firebaseapp.com",
  projectId: "campus-marketplace-a2265",
  storageBucket: "campus-marketplace-a2265.firebasestorage.app",
  messagingSenderId: "392664722575",
  appId: "1:392664722575:web:ef7910d2a5857a55e954fa"
};

const app = initializeApp(firebaseConfig);

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