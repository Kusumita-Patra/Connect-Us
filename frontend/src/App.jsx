import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import AddItem from "./pages/AddItem"; // create this
import SearchResults from "./pages/SearchResults";
import ItemList from "./ItemList";
import ItemDetail from "./ItemDetail";




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<AddItem />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/items" element={<ItemList />} />
        <Route path="/item/:id" element={<ItemDetail />} />
      </Routes>
    </Router>
  );
}

export default App;