import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { db } from "./firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import "./Dashboard.css";

function Dashboard() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [purchases, setPurchases] = useState([]);
  const [mobileNumber, setmobileNumber] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setEmail(currentUser.email);

        // Fetch user profile
        const userRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists())  {
          const userData = docSnap.data();

          setUsername(userData.username);
          setLocation(userData.location);
          setAddress(userData.address);
          setmobileNumber(userData.mobileNumber);

        }

        // Fetch purchased items
        const purchasesRef = collection(db, "purchases");

        const q = query(
          purchasesRef,
          where("buyerId", "==", currentUser.uid)
        );

        const querySnapshot = await getDocs(q);

        const purchasedItems = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPurchases(purchasedItems);

      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
   <div className="dashboardContainer">

  {/* Profile */}
 <div className="profileCard">

  <div className="profileLeft">

    <div className="profileAvatar">
      {username?.charAt(0)}
    </div>

    <div className="profileInfo">

      <h2>{username}</h2>

      <p>📧 {email}</p>

      <p>🏫 {location}</p>
      
      <p>🏠 {address}</p>

      <p>📱 {mobileNumber}</p>

    </div>

  </div>

    <button className="logoutBtn" onClick={handleLogout}>
      Logout
    </button>

  </div>

  {/* Purchases */}
  <div className="purchaseSection">

    <h2>My Purchases</h2>

    {purchases.length === 0 ? (
      <div className="emptyPurchases">
        <h3>No purchases yet</h3>
        <p>Items you buy will appear here.</p>
      </div>
    ) : (
      <div className="purchaseGrid">

        {purchases.map((item) => (
          <div className="purchaseCard" key={item.id}>

            <img src={item.imageUrl} alt={item.name} />

            <div className="purchaseContent">

              <h3>{item.name}</h3>

              <div className="purchasePrice">
                ₹{item.price}
              </div>

              <div className="purchaseCategory">
                {item.category}
              </div>

            </div>

          </div>
        ))}

      </div>
    )}

  </div>

</div>
  );
}

export default Dashboard;