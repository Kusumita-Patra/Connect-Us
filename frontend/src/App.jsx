import React, {
  useEffect,
  useState,
} from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import {
  onAuthStateChanged,
} from "firebase/auth";

import MyChats from "./pages/MyChats";
import { auth } from "./firebase";

import Signup from "./Signup";
import Login from "./Login";

import Dashboard from "./Dashboard";

import Home from "./pages/Home";

import AddItem from "./pages/AddItem";

import SearchResults from "./pages/SearchResults";

import ItemList from "./ItemList";

import ItemDetail from "./ItemDetail";

import ProtectedRoute from "./ProtectedRoute";

import NotificationBell from "./components/NotificationBell";

import ContactSeller from "./ContactSeller";

import ChatPage from "./ChatPage";

import TermsPage from "./pages/TermsPage";

import "./theme.css";

function App() {

  const [
    currentUser,
    setCurrentUser,
  ] = useState(null);

  // FIREBASE AUTH LISTENER

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(

        auth,

        (user) => {

          setCurrentUser(user);

        }
      );

    return () =>
      unsubscribe();

  }, []);

  return (

    <Router>

      {/* NOTIFICATION BELL */}

      <NotificationBell
        currentUser={
          currentUser
        }
      />

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/upload"
          element={

            <ProtectedRoute>

              <AddItem />

            </ProtectedRoute>

          }
        />

        <Route
          path="/search"
          element={
            <SearchResults />
          }
        />

        <Route
          path="/items"
          element={<ItemList />}
        />

        <Route
          path="/item/:id"
          element={
            <ItemDetail />
          }
        />

        <Route
          path="/contact/:id"
          element={
            <ContactSeller />
          }
        />

        <Route
          path="/chat/:chatId"
          element={<ChatPage />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
        <Route
          path="/my-chats"
          element={<MyChats />}
        />
        <Route
          path="/terms"
          element={<TermsPage />}
        />

      </Routes>

    </Router>
  );
}

export default App;