import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Signup from "./Signup";
import Login from "./Login";
import Dashboard from "./Dashboard";

import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>

        {/* Signup */}
        <Route
          path="/"
          element={user ? <Dashboard /> : <Signup />}
        />

        {/* Login */}
        <Route
          path="/login"
          element={user ? <Dashboard /> : <Login />}
        />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Login />}
        />

      </Routes>
    </Router>
  );
}

export default App;
