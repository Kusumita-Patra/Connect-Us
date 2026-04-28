import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Signup from "./Signup";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Home from "./pages/Home";
import AddItem from "./pages/AddItem"; // create this
import SearchResults from "./pages/SearchResults";
import ItemList from "./ItemList";
import ItemDetail from "./ItemDetail";
import ProtectedRoute from "./ProtectedRoute";

import "./theme.css";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route
  path="/upload"
  element={
    <ProtectedRoute>
      <AddItem />
    </ProtectedRoute>
  }
/>
        <Route path="/search" element={<SearchResults />} />
        <Route path="/items" element={<ItemList />} />
        <Route path="/item/:id" element={<ItemDetail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
      </Routes>
    </Router>
  );
}

export default App;