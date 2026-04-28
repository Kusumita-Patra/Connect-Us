import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function ItemList() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "items"), (snapshot) => {
      const itemList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setItems(itemList);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={containerStyle}>
      <div style={headerBar}>
    <h1 style={headingStyle}>All Items</h1>
  </div>

      <div style={gridStyle}>
        {items.map(item => (
          <div
            key={item.id}
            style={cardStyle}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.03)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
          >
            <img src={item.imageUrl} alt="item" style={imageStyle} />

            <div style={{ padding: "10px" }}>
              <h3 style={{ margin: "5px 0" }}>{item.name}</h3>

              <p style={priceStyle}>₹{item.price}</p>
              <p style={categoryStyle}>{item.category}</p>

              <button
                style={buttonStyle}
                onClick={() => navigate(`/item/${item.id}`)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const containerStyle = {
  padding: "20px",
  backgroundColor: "#f5f5f5",
  minHeight: "100vh"
};


const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
  gap: "20px"
};

const cardStyle = {
  backgroundColor: "#fff",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  transition: "transform 0.2s"
};

const imageStyle = {
  width: "100%",
  height: "150px",
  objectFit: "cover"
};

const priceStyle = {
  fontWeight: "bold",
  color: "#2ecc71",
  margin: "5px 0"
};

const categoryStyle = {
  fontSize: "12px",
  color: "#888"
};

const buttonStyle = {
  marginTop: "10px",
  width: "100%",
  padding: "8px",
  backgroundColor: "#ffa73c",
  fontWeight: "bold",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};
const headerBar = {
  width: "100%",
  padding: "20px 0",
  marginBottom: "20px",
  background: "linear-gradient(135deg, #fff648, #e5a846)",
  //borderBottom: "6px solid #1f2a38",
  boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
};

const headingStyle = {
  textAlign: "center",
  color: "#fff",
  fontSize: "32px",
  fontWeight: "bold",
  letterSpacing: "1px",
  margin: 0
};

export default ItemList;