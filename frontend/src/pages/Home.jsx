import "./Home.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase.js"; // ⚠️ adjust path if needed


const Home = () => {

  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  // 🔥 Later connect Firebase here

  useEffect(() => {
    const fetchItems = async () => {
      const querySnapshot = await getDocs(collection(db, "items"));

      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setItems(data);
    };

    fetchItems();
  }, []);
  
  return (
    <div>

      {/* Navbar */}
      <nav className="navbar">
  <h2 className="logo">Connect Us </h2>

  <div className="searchBar">
    <input placeholder="Search items, books, electronics..." />
    <button>Search</button>
  </div>
      <div>
      <h1>Home Page</h1>

      <button onClick={() => navigate("/upload")}>
        Upload Item
      </button>
    </div>

  {/* NEW: Buy + Sell buttons */}
  <div className="navActions">
    <button className="buyBtn">Buy Items</button>
    <button className="sellBtn">Sell Items</button>
  </div>

  <div className="navIcons">
    <span>My Account</span>
    <span>Cart</span>
  </div>
</nav>

      {/* Hero Section */}
      <section className="hero">

        <div className="overlay">

          <h1>Buy and Sell Items Within Campus Easily</h1>
          <p>
            Find second-hand items or sell unused stuff at the best price
            within your college.
          </p>

          {/* Cards */}
          <div className="actionCards">

            <div className="card buy">
              <img src="https://cdn-icons-png.flaticon.com/512/2331/2331970.png" />
              <button>Buy Items</button>
            </div>

            <div className="or">OR</div>

            <div className="card sell">
              <img src="https://cdn-icons-png.flaticon.com/512/3135/3135706.png" />
              <button>Sell Items</button>
            </div>

          </div>

        </div>

      </section>

      {/* 🔥 LISTINGS (DO NOT TOUCH ABOVE UI) */}
<div className="listingsSection">
  <h2>Newly Added Items</h2>

  <div className="listingsContainer">
    {items.length === 0 ? (
      <p className="emptyMsg">No items uploaded yet</p>
    ) : (
      items.map((item) => (
        <div className="listingCard" key={item.id}>
          <img src={item.imageUrl} alt={item.name} />
          
          <p>{item.name}</p>
          <p>{item.description}</p> {/* ADD THIS */}
          
          <h3>₹{item.price}</h3>
          <p>{item.category}</p> {/* ADD THIS */}

          <button>Buy Now</button>
        </div>
      ))
    )}
  </div>
</div>
<div className="pageWrapper">

  <div className="content">
    {/* ALL your existing UI stays here exactly the same */}
  </div>

  <footer className="footer">
    <div className="footerContainer">

      <div className="footerLeft">
        <h3>Connect Us</h3>
        <p>Campus marketplace for buying & selling made simple.</p>
      </div>

      <div className="footerCenter">
        <p>About</p>
        <p>Contact</p>
        <p>Help</p>
      </div>

      <div className="footerRight">
        <p>© 2026 Connect Us</p>
      </div>

    </div>
  </footer>

</div>
    </div>

    
  );
};

export default Home;