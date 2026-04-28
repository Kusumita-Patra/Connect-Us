import React, { useState } from "react";
import { auth } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
import "./Auth.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

const handleSignup = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;
    await setDoc(doc(db, "users", user.uid), {
      username: username,
      email: email,
    });

    alert("User Registered Successfully!");
    navigate("/login");

  } catch (error) {
    alert(error.message);
  }
};

  return (
    <div className="authContainer">
      <div className="authBox">
        <h2>Signup</h2>
      
      <input
        type="text"
        placeholder="Enter username"
        onChange={(e) => setUsername(e.target.value)}
      />
        <input
          type="email"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="authBtn" onClick={handleSignup}>
          Sign Up
        </button>

        <p className="authLink">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;