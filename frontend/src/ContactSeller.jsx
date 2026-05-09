import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

function ContactSeller() {

  const { id } = useParams();

  const [item, setItem] = useState(null);

  useEffect(() => {

    const fetchItem = async () => {

      try {

        const docRef = doc(db, "items", id);

        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setItem(docSnap.data());
        }

      } catch (error) {
        console.error(error);
      }

    };

    fetchItem();

  }, [id]);

  if (!item) return <h2>Loading...</h2>;

  return (

    <div style={containerStyle}>

      <div style={cardStyle}>

        <h1>Seller Details</h1>

        <p>
          <strong>Name:</strong> {item.sellerName}
        </p>

        <p>
          <strong>Phone:</strong> {item.sellerPhone}
        </p>

        <p>
          <strong>Email:</strong> {item.sellerEmail}
        </p>

        <p>
          <strong>Location:</strong> {item.sellerLocation}
        </p>

        <button
        style={chatButtonStyle}
        onClick={() => alert("Chat feature coming soon!")}
        >
        Want to Chat?
        </button>

      </div>

    </div>

  );

}

const containerStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#f5f5f5"
};

const cardStyle = {
  backgroundColor: "#fff",
  padding: "30px",
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  width: "350px",
  lineHeight: "2"
};

const chatButtonStyle = {
  marginTop: "20px",
  width: "100%",
  padding: "12px",
  backgroundColor: "#6D69D3",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer"
};


export default ContactSeller;