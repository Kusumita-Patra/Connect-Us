import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import "./ItemDetail.css";

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const docRef = doc(db, "items", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setItem(docSnap.data());
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
        
        {/* Image */}
        <img
          src={item.imageUrl}
          alt={item.name}
          className="itemImage"
        />

        {/* Details */}
        <div className="itemDetails">
          <div className="itemTitle">{item.name}</div>

          <div className="itemPrice">₹{item.price}</div>

          <div className="itemCategory">
            Category: {item.category}
          </div>

          <div className="itemDesc">
            {item.description}
          </div>

          {/* Buttons */}
          <div className="actionButtons">
            <button className="buyBtn">
              Buy Now
            </button>

            <button className="contactBtn">
              Add to Cart
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ItemDetail;