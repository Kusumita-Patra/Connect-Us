import "./Home.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase.js";


const Home = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      const querySnapshot = await getDocs(collection(db, "items"));

      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setItems(data);
    };

    fetchItems();
  }, []);

  return (
    <div>

      {/* Navbar */}
      <nav className="navbar">
        <h2 className="logo">Connect Us</h2>

        {/* ✅ UPDATED SEARCH BAR */}
        <div className="searchBar">
          <select
    className="searchCategory"
    value={category}
    onChange={(e) => setCategory(e.target.value)}
  >
    <option value="">All</option>
    <option value="Books">Books</option>
    <option value="Electronics">Electronics</option>
  </select>

  <input
    className="searchInput"
    placeholder="Search items, books, electronics..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  <button
    className="searchBtn"
    onClick={() =>
      navigate(`/search?query=${search}&category=${category}`)
    }
  >
    Search
  </button>
        </div>

        <div className="navActions">
          <button
  className="buyBtn"
  onClick={() => navigate("/items")}
>
  Buy Items
</button>
          <button
  className="sellBtn"
  onClick={() => navigate("/upload")}
>
  Sell Items
</button>
        </div>
        <button
  className="viewAllBtn"
  onClick={() => navigate("/items")}
>
  View All Items
</button>
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

          <div className="actionCards">
            <div
  className="card buy"
  onClick={() => navigate("/items")}
>
  <img src="https://cdn-icons-png.flaticon.com/512/2331/2331970.png" />
  <button>Buy Items</button>
</div>

            <div className="or">OR</div>

            <div className="card sell">
  <img src="https://cdn-icons-png.flaticon.com/512/3135/3135706.png" />
  <button onClick={() => navigate("/upload")}>
    Sell Items
  </button>
</div>
          </div>
        </div>
      </section>

      {/* Listings */}
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
                <p>{item.description}</p>

                <h3>₹{item.price}</h3>
                <p>{item.category}</p>

                <button>Buy Now</button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="pageWrapper">
        <div className="content"></div>

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