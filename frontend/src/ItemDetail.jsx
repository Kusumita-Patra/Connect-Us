import React, { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import { db, auth } from "./firebase";

import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

import "./ItemDetail.css";

function ItemDetail() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [item, setItem] = useState(null);

  const handleChat = async () => {
    try {
      console.log("BUTTON CLICKED");

      const buyerId = auth.currentUser.uid;

      console.log("buyerId:", buyerId);

      console.log("item:", item);

      const sellerId = item.sellerId;

      console.log("sellerId:", sellerId);

      const itemId = id;

      const chatId =
        buyerId < sellerId
          ? `${buyerId}_${sellerId}_${itemId}`
          : `${sellerId}_${buyerId}_${itemId}`;

      console.log("chatId:", chatId);

      const chatRef = doc(db, "chats", chatId);

      const chatSnap = await getDoc(chatRef);

      if (!chatSnap.exists()) {
        console.log("Creating chat");

        await setDoc(chatRef, {
          buyerId,
          sellerId,
          itemId,

          participants: [buyerId, sellerId],

          createdAt: serverTimestamp(),

          lastMessage: "",
        });
      }

      console.log("Navigating");

      navigate(`/chat/${chatId}`);
    } catch (error) {
      console.error(error);
    }
  };

  // FETCH ITEM

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const docRef = doc(db, "items", id);

        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setItem({
            id: docSnap.id,
            ...docSnap.data(),
          });
        } else {
          console.log("No such item!");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchItem();
  }, [id]);

  if (!item) return <h2>Loading...</h2>;

  return (
    <div className="itemDetailContainer">
      <div className="itemCard">
        {/* IMAGE */}

        <img src={item.imageUrl} alt={item.name} className="itemImage" />

        {/* DETAILS */}

        <div className="itemDetails">
          <div className="itemTitle">{item.name}</div>

          <div className="itemPrice">₹{item.price}</div>

          <div
            className={
              item.status === "Sold Out" ? "soldStatus" : "stockStatus"
            }
          >
            {item.status}
          </div>

          <div className="itemCategory">Category: {item.category}</div>

          <div className="itemDesc">{item.description}</div>

          {/* BUTTONS */}

          <div className="actionButtons">
            <button
              className="buyBtn"
              onClick={() => navigate(`/contact/${id}`)}
            >
              Contact Seller
            </button>

            <button className="contactBtn">Add to Cart</button>

            <button className="chatBtn" onClick={handleChat}>
              Chat with Seller
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemDetail;
