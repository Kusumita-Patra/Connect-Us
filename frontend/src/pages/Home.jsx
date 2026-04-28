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
        <h2 className="logo">Connect Us</h2>

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

        <button
          className="viewAllBtn"
          onClick={() => navigate("/items")}
        >
          View All Items
        </button>

        {/* User Section */}
        <div className="navIcons">
          {user ? (
            <>
              <span>{user.name}</span>
              <span onClick={() => navigate("/dashboard")}>
                Dashboard
              </span>
            </>
          ) : (
            <>
              <span onClick={() => navigate("/login")}>Login</span>
              <span onClick={() => navigate("/signup")}>Signup</span>
            </>
          )}
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
              <img src="https://cdn-icons-png.flaticon.com/512/2331/2331970.png" alt="buy" />
              <button>Buy Items</button>
            </div>

            <div className="or">OR</div>

            <div className="card sell">
              <img src="https://cdn-icons-png.flaticon.com/512/3135/3135706.png" alt="sell" />
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