import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const query = params.get("query") || "";
  const category = params.get("category") || "";

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "items"));

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filtered = data.filter((item) => {
        const matchesCategory = category
          ? item.category === category
          : true;

        const matchesQuery =
          item.name?.toLowerCase().includes(query.toLowerCase()) ||
          item.description?.toLowerCase().includes(query.toLowerCase());

        return matchesCategory && matchesQuery;
      });

      setResults(filtered);
    };

    fetchData();
  }, [query, category]);

  return (
    <div>

      {/* 🔥 NAVBAR WITH SEARCH BAR */}
      <nav className="navbar">
        <h2 className="logo" onClick={() => navigate("/")}>
          Connect Us
        </h2>

        {/* SEARCH BAR MOVED HERE */}
        <div className="searchBar">

          <select
            className="searchCategory"
            value={category}
            onChange={(e) =>
              navigate(`/search?query=${query}&category=${e.target.value}`)
            }
          >
            <option value="">All</option>
            <option value="Books">Books</option>
            <option value="Electronics">Electronics</option>
          </select>

          <input
            className="searchInput"
            value={query}
            onChange={(e) =>
              navigate(`/search?query=${e.target.value}&category=${category}`)
            }
            placeholder="Search items..."
          />

          <button
            className="searchBtn"
            onClick={() =>
              navigate(`/search?query=${query}&category=${category}`)
            }
          >
            Search
          </button>

        </div>

        <div className="navIcons">
          <span>My Account</span>
          <span>Cart</span>
        </div>
      </nav>

      {/* 🔥 TITLE */}
      <div className="listingsSection">
        <h2>
          Search results for "{query}"
          {category ? ` (${category})` : ""}
        </h2>

        {/* RESULTS */}
        <div className="listingsContainer">
          {results.length === 0 ? (
            <p className="emptyMsg">No matching items found</p>
          ) : (
            results.map((item) => (
              <div className="listingCard" key={item.id}>
                <img src={item.imageUrl} alt={item.name} />

                <h3>{item.name}</h3>
                <p>{item.description}</p>

                <p className="price">₹{item.price}</p>
                <p className="category">{item.category}</p>

                <button>Buy Now</button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* FOOTER */}
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
  );
};

export default SearchResults;