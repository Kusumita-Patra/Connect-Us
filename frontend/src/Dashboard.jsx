import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import AddItem from "./pages/AddItem";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import "./Dashboard.css";

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      // fetch username from Firestore
      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUsername(docSnap.data().username);
      }
    } else {
      navigate("/login");
    }
  });

  return () => unsubscribe();
}, [navigate]);



  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out!");
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="dashboardContainer">
      <div className="dashboardHeader">
        
        <button className="logoutBtn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <h3>Welcome, {username}</h3>

      <AddItem />
    </div>
  );
}

export default Dashboard;