import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

export const sendChatNotification = async ({
  sellerId,
  buyerId,
  itemId,
  itemTitle,
  buyerName,
}) => {
  try {
    await addDoc(collection(db, "notifications"), {
      type: "chat_request",
      sellerId,
      buyerId,
      itemId,
      itemTitle,
      buyerName,
      message: `${buyerName} wants to chat about ${itemTitle}`,
      read: false,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Notification Error:", error);
  }
};