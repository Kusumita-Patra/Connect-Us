import React, { useEffect, useState } from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import { db, auth } from "./firebase";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import "./ItemDetail.css";



function ItemDetail() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [item, setItem] = useState(null);



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

        <img
          src={item.imageUrl}
          alt={item.name}
          className="itemImage"
        />

        {/* DETAILS */}

        <div className="itemDetails">

          <div className="itemTitle">
            {item.name}
          </div>

          <div className="itemPrice">
            ₹{item.price}
          </div>

          <div className="itemCategory">
            Category: {item.category}
          </div>

          <div className="itemDesc">
            {item.description}
          </div>

          {/* BUTTONS */}

          <div className="actionButtons">

            <button
              className="buyBtn"
              onClick={() =>
                navigate(`/contact/${id}`)
              }
            >
              Contact Seller
            </button>

            <button
              className="contactBtn"
            >
              Add to Cart
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ItemDetail;