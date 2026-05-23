import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

export const createOrGetChat =
  async ({

    buyerId,

    sellerId,

    itemId,

    itemName,

  }) => {

    // UNIQUE CHAT ID

    const chatId =
      buyerId < sellerId
        ? `${buyerId}_${sellerId}_${itemId}`
        : `${sellerId}_${buyerId}_${itemId}`;

    const chatRef = doc(
      db,
      "chats",
      chatId
    );

    // CHECK IF CHAT EXISTS

    const chatSnap =
      await getDoc(chatRef);

    // CREATE ONLY IF NOT EXISTS

    if (!chatSnap.exists()) {

      await setDoc(
        chatRef,
        {

          buyerId,

          sellerId,

          itemId,

          itemName,

          participants: [
            buyerId,
            sellerId,
          ],

          createdAt:
            serverTimestamp(),

          lastMessage: "",
        }
      );
    }

    return chatId;
};