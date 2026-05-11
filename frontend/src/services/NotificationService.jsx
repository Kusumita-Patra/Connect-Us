import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

export const sendChatNotification =
  async ({
    sellerId,
    buyerId,
    itemId,
    itemTitle,
    buyerName,
    chatId,
  }) => {

    try {

      await addDoc(
        collection(
          db,
          "notifications"
        ),

        {
          sellerId,

          buyerId,

          itemId,

          itemTitle,

          buyerName,

          chatId,

          message:
            `${buyerName} wants to chat about "${itemTitle}"`,

          read: false,

          createdAt:
            serverTimestamp(),
        }
      );

    } catch (error) {

      console.error(error);

    }
  };