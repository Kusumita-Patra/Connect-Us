import "./Home.css";
import React, { useEffect, useState } from "react";

const Home = () => {

  const [items, setItems] = useState([]);

  // 🔥 Later connect Firebase here
  useEffect(() => {
    setItems([]); // keep empty for now
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
          <h3>₹{item.price}</h3>
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