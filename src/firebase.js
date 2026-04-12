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

export const auth = getAuth(app);