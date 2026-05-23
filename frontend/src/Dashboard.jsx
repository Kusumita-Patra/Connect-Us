import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";
import "./Dashboard.css";

function Dashboard() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [purchases, setPurchases] = useState([]);
  const [mobileNumber, setmobileNumber] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [myChats, setMyChats] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [myItems, setMyItems] = useState([]); // NEW STATE FOR SELLER LISTINGS

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate("/login");
        return;
      }

      // EMAIL
      setEmail(currentUser.email);

      // USER PROFILE
      try {
        const userRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUsername(userData.username);
          setLocation(userData.location);
          setAddress(userData.address);
          setmobileNumber(userData.mobileNumber);
        }
      } catch (error) {
        console.error(error);
      }

      // PURCHASES
      try {
        const purchasesRef = collection(db, "purchases");
        const purchasesQuery = query(
          purchasesRef,
          where("buyerId", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(purchasesQuery);
        const purchasedItems = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPurchases(purchasedItems);
      } catch (error) {
        console.error(error);
      }

      // NEW: FETCH SELLER'S LISTED ITEMS REALTIME
      const itemsRef = collection(db, "items");
      const myItemsQuery = query(itemsRef, where("sellerId", "==", currentUser.uid));
      
      const unsubscribeMyItems = onSnapshot(myItemsQuery, (snapshot) => {
        const itemsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMyItems(itemsData);
      }, (error) => {
        console.error("Error fetching listed items:", error);
      });

      // REALTIME CART
      const cartRef = collection(db, "users", currentUser.uid, "cart");
      const unsubscribeCart = onSnapshot(cartRef, (snapshot) => {
        const cartData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCartItems(cartData);
      });

      // REALTIME CHATS
      const chatsQuery = query(
        collection(db, "chats"),
        where("participants", "array-contains", currentUser.uid)
      );
      const unsubscribeChats = onSnapshot(
        chatsQuery,
        (snapshot) => {
          const chats = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMyChats(chats);
        },
        (error) => {
          console.error(error);
        }
      );

      return () => {
        unsubscribeChats();
        unsubscribeCart();
        unsubscribeMyItems(); // Clean up listed items listener
      };
    });

    return () => unsubscribe();
  }, [navigate]);

  // REMOVE CART ITEM
  const removeFromCart = async (itemId) => {
    try {
      await deleteDoc(doc(db, "users", auth.currentUser.uid, "cart", itemId));
    } catch (error) {
      console.error(error);
    }
  };

  // LOGOUT
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
      {/* PROFILE CARD */}
      <div className="profileCard">
        <div className="profileLeft">
          <div className="profileAvatar">{username?.charAt(0)}</div>
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

      {/* NEW: MY LISTED ITEMS SECTION (Hides completely if empty) */}
{myItems.length > 0 && (
  <div className="cartSection">
    <h2>My Listed Items</h2>
    <div className="cartGrid">
      {myItems.map((item) => (
        <div
          className="cartCard"
          key={item.id}
          onClick={() => navigate(`/item/${item.id}`)}
          style={{ cursor: "pointer" }}
        >
          <img src={item.imageUrl} alt={item.name} />
          <div className="cartContent">
            <h3>{item.name}</h3>
            <div className="cartPrice">₹{item.price}</div>
            <div className="cartCategory">{item.category}</div>
            <div 
              style={{ 
                marginTop: "10px", 
                fontSize: "12px", 
                fontWeight: "bold", 
                color: item.status === "Sold Out" ? "#dc3545" : "#28a745" 
              }}
            >
              Status: {item.status || "Available"}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

      {/* MY CART */}
      <div className="cartSection">
        <h2>My Cart</h2>
        {cartItems.length === 0 ? (
          <div className="emptyPurchases">
            <h3>Cart is empty</h3>
          </div>
        ) : (
          <div className="cartGrid">
            {cartItems.map((item) => (
              <div
                className="cartCard"
                key={item.id}
                onClick={() => navigate(`/item/${item.itemId}`)}
                style={{ cursor: "pointer" }}
              >
                <img src={item.imageUrl} alt={item.name} />
                <div className="cartContent">
                  <h3>{item.name}</h3>
                  <div className="cartPrice">₹{item.price}</div>
                  <div className="cartCategory">{item.category}</div>
                  <button
                    className="removeCartBtn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromCart(item.id);
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PURCHASES */}
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
                  <div className="purchasePrice">₹{item.price}</div>
                  <div className="purchaseCategory">{item.category}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MY CHATS */}
      <div className="purchaseSection">
        <h2>My Chats</h2>
        {myChats.filter(
          (chat) => chat.lastMessage && chat.lastMessage !== "No messages yet"
        ).length === 0 ? (
          <div className="emptyPurchases">
            <h3>No chats yet</h3>
          </div>
        ) : (
          <div className="purchaseGrid">
            {myChats
              .filter(
                (chat) => chat.lastMessage && chat.lastMessage !== "No messages yet"
              )
              .map((chat) => (
                <div
                  key={chat.id}
                  className="purchaseCard"
                  onClick={() => navigate(`/chat/${chat.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="purchaseContent">
                    <h3>{chat.itemName || "Chat"}</h3>
                    <p>{chat.lastMessage}</p>
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