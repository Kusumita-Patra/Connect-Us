import React from "react";
import { auth } from "../../src/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import AddItem from "./pages/AddItem";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    alert("Logged out!");
    navigate("/login");
  };

  return (
    <div>
      <h2>Dashboard</h2>

      <h3>Welcome: {auth.currentUser?.email}</h3>

      <br />

      <button onClick={handleLogout}>Logout</button>
      <AddItem />
    </div>
  );
}

export default Dashboard;