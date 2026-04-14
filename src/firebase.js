// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyCNy4mHcENyyORaAUGR7u17RC2834IuqNc",
//   authDomain: "campus-marketplace-a2265.firebaseapp.com",
//   projectId: "campus-marketplace-a2265",
//   storageBucket: "campus-marketplace-a2265.firebasestorage.app",
//   messagingSenderId: "392664722575",
//   appId: "1:392664722575:web:ef7910d2a5857a55e954fa"
// };

// const app = initializeApp(firebaseConfig);

// Import Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD1fY0ctH9xQ36ZPNeTdC6tcfv8mZxqcL4",
  authDomain: "connect-us2-79eda.firebaseapp.com",
  projectId: "connect-us2-79eda",
  storageBucket: "connect-us2-79eda.firebasestorage.app",
  messagingSenderId: "841422314854",
  appId: "1:841422314854:web:1c5a64aadc513ed5c87ca7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Export
export { db, auth, storage };