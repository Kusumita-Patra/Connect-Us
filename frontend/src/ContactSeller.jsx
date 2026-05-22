import React, {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import {
  db,
  auth,
} from "./firebase";

import {
  sendChatNotification,
} from "./services/NotificationService";

import {
  createOrGetChat,
} from "./services/chatService";


function ContactSeller() {

  const { id } = useParams();

  const navigate =
    useNavigate();

  const [item, setItem] =
    useState(null);

  const [seller, setSeller] =
    useState(null);

  // FETCH ITEM + SELLER

  useEffect(() => {

    const fetchData = async () => {

      try {

        // ITEM

        const itemRef = doc(
          db,
          "items",
          id
        );

        const itemSnap =
          await getDoc(itemRef);

        if (!itemSnap.exists()) {

          console.log(
            "Item not found"
          );

          return;
        }

        const itemData = {

          id: itemSnap.id,

          ...itemSnap.data(),

        };

        setItem(itemData);

        // SELLER

        if (itemData.sellerId) {

          const sellerRef = doc(
            db,
            "users",
            itemData.sellerId
          );

          const sellerSnap =
            await getDoc(
              sellerRef
            );

          if (
            sellerSnap.exists()
          ) {

            setSeller(
              sellerSnap.data()
            );
          }
        }

      } catch (error) {

        console.error(error);

      }
    };

    fetchData();

  }, [id]);

  // START CHAT

  const handleStartChat =
    async () => {
      if (!auth.currentUser) {

        alert(
          "Please login first to chat with the seller."
        );

        navigate("/login");

        return;
      }

      try {

        const buyerId =
          auth.currentUser.uid;

        const sellerId =
          item.sellerId;

        // GET BUYER DETAILS

        const buyerRef = doc(
          db,
          "users",
          buyerId
        );

        const buyerSnap =
          await getDoc(
            buyerRef
          );

        const buyerData =
          buyerSnap.data();

        console.log(
          "BUYER USERNAME:",
          buyerData?.username
        );

        // CREATE OR GET CHAT

        const chatId =
          await createOrGetChat({

            buyerId,

            sellerId,

            itemId:
              item.id,

            itemName:
              item.name,
          });

        // SEND NOTIFICATION

        await sendChatNotification({

          sellerId,

          buyerId,

          itemId:
            item.id,

          itemTitle:
            item.name,

          buyerName:
            buyerData?.username ||
            "Someone",

          chatId,
        });

        // OPEN CHAT

        navigate(
          `/chat/${chatId}`
        );

      } catch (error) {

        console.error(error);

      }
    };
  // LOADING

  if (!item)
    return <h2>Loading...</h2>;

  if (
    !seller &&
    !item.sellerName
  ) {

    return (
      <h2>
        Seller not found
      </h2>
    );
  }

  return (

    <div style={containerStyle}>

      <div style={cardStyle}>

        <h1>
          Seller Details
        </h1>

        <p>

          <strong>
            Name:
          </strong>

          {" "}

          {seller?.username ||
            item.sellerName}

        </p>

        <p>

          <strong>
            Phone:
          </strong>

          {" "}

          {seller?.mobileNumber ||
            item.sellerPhone}

        </p>

        <p>

          <strong>
            Email:
          </strong>

          {" "}

          {seller?.email ||
            item.sellerEmail}

        </p>

        <p>

          <strong>
            Location:
          </strong>

          {" "}

          {seller?.location ||
            item.sellerLocation}

        </p>

        <button
          style={
            chatButtonStyle
          }
          onClick={
            handleStartChat
          }
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

  justifyContent:
    "center",

  alignItems:
    "center",

  backgroundColor:
    "#f5f5f5",
};

const cardStyle = {

  backgroundColor:
    "#fff",

  padding: "30px",

  borderRadius: "12px",

  boxShadow:
    "0 4px 10px rgba(0,0,0,0.1)",

  width: "550px",

  lineHeight: "2",
};

const chatButtonStyle = {

  marginTop: "20px",

  width: "100%",

  padding: "12px",

  backgroundColor:
    "#6D69D3",

  color: "#fff",

  border: "none",

  borderRadius: "8px",

  fontSize: "16px",

  fontWeight: "bold",

  cursor: "pointer",
};

export default ContactSeller;