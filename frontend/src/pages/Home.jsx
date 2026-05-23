import "./Home.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const Home = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [user, setUser] = useState(null);

  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "items"));

        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setItems(data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, []);

  // ✅ Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="logoSection">

  <h2 className="logo">Connect Us</h2>

  <div className="mobileProfile">

    {user ? (

      <span
        className="profileLink"
        onClick={() => navigate("/dashboard")}
      >
        My Profile
      </span>

    ) : (

      <>
        <span
          className="profileLink"
          onClick={() => navigate("/login")}
        >
          Login
        </span>

        <span
          className="profileLink"
          onClick={() => navigate("/signup")}
        >
          Signup
        </span>
      </>

    )}

  </div>

</div>
        {/* Search Bar */}
        <div className="searchBar">
          <select
            className="searchCategory"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All</option>
            <option value="Books">Books</option>
            <option value="Electronics">Electronics</option>
            <option value="Stationery">Stationery</option>
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

        {/* Actions */}
        <div className="navActions">
          <button className="buyBtn" onClick={() => navigate("/items")}>
            Buy Items
          </button>

          <button
            className="sellBtn"
            onClick={() => {
              if (user) {
                navigate("/upload");
              } else {
                alert("Please login first!");
                navigate("/login");
              }
            }}
          >
            Sell Items
          </button>
        </div>

        <button className="viewAllBtn" onClick={() => navigate("/items")}>
          View All Items
        </button>

        <div className="desktopProfile">

  {user ? (

    <span
      className="profileLink"
      onClick={() => navigate("/dashboard")}
    >
      My Profile
    </span>

  ) : (

    <>
      <span
        className="profileLink"
        onClick={() => navigate("/login")}
      >
        Login
      </span>

      <span
        className="profileLink"
        onClick={() => navigate("/signup")}
      >
        Signup
      </span>
    </>

  )}

</div>

        {/* User Section */}
       {/* User Section */}

      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="overlay">
          <h1>Buy and Sell Items Within Campus Easily</h1>
          <p>
            Find second-hand items or sell unused stuff at the best price within
            your college.
          </p>

          <div className="actionCards">
            <div className="card buy" onClick={() => navigate("/items")}>
              <img
                src="https://cdn-icons-png.flaticon.com/512/2331/2331970.png"
                alt="buy"
              />
              <button>Buy Items</button>
            </div>

            <div className="or">OR</div>

            <div className="card sell">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135706.png"
                alt="sell"
              />
              <button
                onClick={() => {
                  if (user) {
                    navigate("/upload");
                  } else {
                    alert("Please login first!");
                    navigate("/login");
                  }
                }}
              >
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
              <div
                className="listingCard"
                key={item.id}
                onClick={() => navigate(`/item/${item.id}`)}
                style={{ cursor: "pointer" }}
              >
                <img src={item.imageUrl} alt={item.name} />

                <p>{item.name}</p>
                <p>{item.description}</p>

                <h3>₹{item.price}</h3>

                <div
                  className={
                    item.status === "Sold Out" ? "soldStatus" : "stockStatus"
                  }
                >
                  {item.status}
                </div>

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
              <p onClick={() => setShowAbout(true)}>
  About
</p>
              <p onClick={() => setShowContact(true)}>
  Contact
</p>
              <p onClick={() => setShowHelp(true)}>
  Help
</p>
            </div>

            <div className="footerRight">
              <p>© 2026 Connect Us</p>
            </div>
          </div>
        </footer>
      </div>
      {showAbout && (

  <div className="aboutModalOverlay">

    <div className="aboutModal">

      <button
        className="closeModalBtn"
        onClick={() => setShowAbout(false)}
      >
        ✕
      </button>

      <h2>About Connect Us</h2>

      <p className="aboutText">
        Connect Us is a campus marketplace platform
        built to help students buy and sell second-hand
        items easily within their college community.
      </p>

      <h3>Team Members</h3>

      <div className="teamList">

        <div className="teamCard">
          <h4>Asmita Chakraborty</h4>
          <p>Frontend & backend handling</p>
        </div>

        <div className="teamCard">
          <h4>Kusumita Patra</h4>
          <p>Backend, Firebase and Frontend</p>
        </div>

        <div className="teamCard">
          <h4>Abhimitra Roy</h4>
          <p>UI/UX handling</p>
        </div>

        <div className="teamCard">
          <h4>Banibrata Ghosh</h4>
          <p>Testing & Documentation</p>
        </div>

      </div>

    </div>

  </div>

)}

  {showContact && (

  <div className="aboutModalOverlay">

    <div className="aboutModal">

      <button
        className="closeModalBtn"
        onClick={() => setShowContact(false)}
      >
        ✕
      </button>

      <h2>Contact Us</h2>

      <p className="aboutText">
        We'd love to hear from you.
        Reach out to our team anytime.
      </p>

      <div className="teamList">

        <div className="teamCard">
          <h4>Email</h4>
          <p>connectus.support@gmail.com</p>
        </div>

        <div className="teamCard">
          <h4>Phone</h4>
          <p>+91 9876543210</p>
        </div>

        <div className="teamCard">
          <h4>Location</h4>
          <p>Heritage Institute of Technology, Kolkata</p>
        </div>

      </div>

    </div>

  </div>

)}

{showHelp && (

  <div className="aboutModalOverlay">

    <div className="aboutModal">

      <button
        className="closeModalBtn"
        onClick={() => setShowHelp(false)}
      >
        ✕
      </button>

      <h2>Help Center</h2>

      <p className="aboutText">
        Here are some quick tips to use Connect Us smoothly.
      </p>

      <div className="teamList">

        <div className="teamCard">
          <h4>Buying Items</h4>
          <p>
            Browse listings, open item details,
            and contact or chat with sellers directly.
          </p>
        </div>

        <div className="teamCard">
          <h4>Selling Items</h4>
          <p>
            Upload product details with images,
            price, and category to list your item.
          </p>
        </div>

        <div className="teamCard">
          <h4>Reviews & Ratings</h4>
          <p>
            Buyers can rate items, leave reviews,
            and give feedback about sellers.
          </p>
        </div>

      </div>

    </div>

  </div>

)}
    </div>
  );
};

export default Home;
