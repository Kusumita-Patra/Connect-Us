import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { db, auth } from "./firebase";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { sendChatNotification }
from "./services/notificationService";

function ContactSeller() {

  const { id } = useParams();

  const [item, setItem] = useState(null);

  const [seller, setSeller] = useState(null);

  useEffect(() => {

    const fetchData = async () => {

      try {

        // FETCH ITEM

        const itemRef = doc(db, "items", id);

        const itemSnap = await getDoc(itemRef);

        if (itemSnap.exists()) {

          const itemData = {
            id: itemSnap.id,
            ...itemSnap.data(),
          };

          setItem(itemData);

          // FETCH SELLER FROM USERS COLLECTION

          const sellerRef = doc(
            db,
            "users",
            itemData.sellerId
          );

          const sellerSnap =
            await getDoc(sellerRef);

          if (sellerSnap.exists()) {

            setSeller(sellerSnap.data());

          }
        }

      } catch (error) {

        console.error(error);

      }
    };

    fetchData();

  }, [id]);

  // CHAT REQUEST

  const handleStartChat = async () => {

    try {

      await sendChatNotification({

        sellerId: item.sellerId,

        buyerId: auth.currentUser.uid,

        itemId: item.id,

        itemTitle: item.name,

        buyerName:
          auth.currentUser.email || "Someone",

      });

      alert("Chat request sent!");

    } catch (error) {

      console.error(error);

    }
  };

  // LOADING STATES

  if (!item)
    return <h2>Loading item...</h2>;

  if (!seller && !item.sellerName)
  return <h2>Seller not found</h2>;

  return (

    <div style={containerStyle}>

      <div style={cardStyle}>

        <h1>Seller Details</h1>

        <p>
          <strong>Name:</strong>
          {seller?.username || item.sellerName}
        </p>

        <p>
          <strong>Phone:</strong>
          {seller?.mobileNumber || item.sellerPhone}
        </p>

        <p>
          <strong>Email:</strong>
          {seller?.email || item.sellerEmail}
        </p>

        <p>
          <strong>Location:</strong>
          {seller?.location || item.sellerLocation}
        </p>

        <button
          style={chatButtonStyle}
          onClick={handleStartChat}
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
  width: "550px",
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