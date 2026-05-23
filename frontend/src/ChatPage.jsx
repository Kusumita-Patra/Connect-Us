import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "./firebase";
import { sendChatNotification } from "./services/NotificationService";

function ChatPage() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // LOAD MESSAGES
  useEffect(() => {
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [chatId]);

  // HELPER TO FORMAT TIMESTAMP
  const formatTime = (createdAt) => {
    if (!createdAt) return "Sending..."; // Fallback for latency compensation
    
    // Convert Firestore Timestamp to JavaScript Date object
    const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
    
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // SEND MESSAGE
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const currentUserId = auth.currentUser.uid;

      // GET CHAT INFO
      let chatRef = doc(db, "chats", chatId);
      let chatSnap = await getDoc(chatRef);
      let chatData;

      // IF CHAT DOESN'T EXIST, CREATE IT NOW
      if (!chatSnap.exists()) {
        const itemId = chatId.split("_")[2];
        const itemRef = doc(db, "items", itemId);
        const itemSnap = await getDoc(itemRef);
        const itemData = itemSnap.data();

        const sellerId = itemData.sellerId;
        const buyerId = currentUserId;

        // Assuming createOrGetChat is defined elsewhere or handled
        // await createOrGetChat({ buyerId, sellerId, itemId, itemName: itemData.name });

        chatSnap = await getDoc(chatRef);
      }

      chatData = chatSnap.data();

      // RECEIVER
      const receiverId =
        currentUserId === chatData.buyerId
          ? chatData.sellerId
          : chatData.buyerId;

      // SEND MESSAGE
      await addDoc(collection(db, "chats", chatId, "messages"), {
        text: newMessage,
        senderId: currentUserId,
        createdAt: serverTimestamp(),
      });

      // UPDATE LAST MESSAGE
      await updateDoc(doc(db, "chats", chatId), {
        lastMessage: newMessage,
        lastMessageTime: serverTimestamp(),
      });

      // USER DETAILS
      const userRef = doc(db, "users", currentUserId);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();

      // ITEM DETAILS
      const itemRef = doc(db, "items", chatData.itemId);
      const itemSnap = await getDoc(itemRef);
      const itemData = itemSnap.data();

      // SEND NOTIFICATION
      await sendChatNotification({
        sellerId: receiverId,
        buyerId: currentUserId,
        itemId: chatData.itemId,
        itemTitle: itemData?.name || "Item",
        buyerName: userData?.username || "Someone",
        chatId,
      });

      setNewMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
      }}
    >
      <div
        style={{
          width: "500px",
          height: "80vh",
          background: "white",
          borderRadius: "12px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            padding: "15px",
            background: "#007bff",
            color: "white",
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          Chat
        </div>

        {/* MESSAGES */}
        <div
          style={{
            flex: 1,
            padding: "15px",
            overflowY: "auto",
            background: "#f0f2f5",
          }}
        >
          {messages.map((msg) => {
            const isMe = msg.senderId === auth.currentUser.uid;
            return (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: isMe ? "flex-end" : "flex-start",
                  marginBottom: "12px",
                }}
              >
                {/* Bubble Wrapper */}
                <div
                  style={{
                    background: isMe ? "#007bff" : "white",
                    color: isMe ? "white" : "black",
                    padding: "10px 14px",
                    borderRadius: "14px",
                    maxWidth: "70%",
                    wordBreak: "break-word",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
                  }}
                >
                  {msg.text}
                </div>
                
                {/* Timestamp Row */}
                <span
                  style={{
                    fontSize: "11px",
                    color: "#8e8e93",
                    marginTop: "4px",
                    padding: "0 4px",
                  }}
                >
                  {formatTime(msg.createdAt)}
                </span>
              </div>
            );
          })}
        </div>

        {/* INPUT AREA */}
        <div
          style={{
            display: "flex",
            padding: "12px",
            borderTop: "1px solid #ddd",
            background: "white",
          }}
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type message..."
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "25px",
              border: "1px solid #ccc",
              outline: "none",
              fontSize: "15px",
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              marginLeft: "10px",
              padding: "10px 18px",
              border: "none",
              borderRadius: "25px",
              background: "#007bff",
              color: "white",
              cursor: "pointer",
              fontSize: "15px",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;