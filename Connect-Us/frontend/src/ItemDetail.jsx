import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      const docRef = doc(db, "items", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setItem(docSnap.data());
      }
    };

    fetchItem();
  }, [id]);

  if (!item) return <p>Loading...</p>;

  return (
    <div>
      <img src={item.imageUrl} alt="" width="300" />
      <h2>{item.name}</h2>
      <p>Price: ₹{item.price}</p>
      <p>Category: {item.category}</p>
      <p>{item.description}</p>
    </div>
  );
}

export default ItemDetail;