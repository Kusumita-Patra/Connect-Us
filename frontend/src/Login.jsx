import React, { useState } from "react";
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);

      alert("Login Successful!");
      navigate("/dashboard");

    } catch (error) {
      alert(error.message);
    }
  };

  return (
  <div className="authContainer">
    <div className="authBox">
      <h2>Login</h2>

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

      <button className="authBtn" onClick={handleLogin}>
        Login
      </button>

      <p className="authLink">
        Don't have an account? <Link to="/signup">Signup</Link>
      </p>
    </div>
  </div>
);
}

export default Login;