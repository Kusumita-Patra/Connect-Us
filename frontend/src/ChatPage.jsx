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
  const [chatData, setChatData] = useState(null);
  const [showTcModal, setShowTcModal] = useState(false);

  const currentUserId = auth.currentUser?.uid;

  // 1. WATCH CHAT REAL-TIME (Tracks status changes instantly)
  useEffect(() => {
    const chatRef = doc(db, "chats", chatId);
    const unsubscribe = onSnapshot(chatRef, (snapshot) => {
      if (snapshot.exists()) {
        setChatData(snapshot.data());
      }
    });
    return () => unsubscribe();
  }, [chatId]);

  // 2. WATCH MESSAGES STREAM
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

  const formatTime = (createdAt) => {
    if (!createdAt) return "Sending...";
    const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const sendSystemMessage = async (text) => {
    await addDoc(collection(db, "chats", chatId, "messages"), {
      text,
      senderId: "system",
      createdAt: serverTimestamp(),
    });
  };

  // BUY ACTIONS
  const handleBuyClick = () => setShowTcModal(true);

  const confirmBuyOrder = async () => {
    try {
      setShowTcModal(false);
      await updateDoc(doc(db, "chats", chatId), {
        status: "buyer_initiated",
      });
      await sendSystemMessage("🛍️ Buyer has requested to buy this item and accepted the Terms & Conditions. Waiting for Seller confirmation.");
    } catch (error) {
      console.error("Error initiating buy:", error);
    }
  };

  // 6. SELLER: CONFIRM ORDER COMPLETION (Updated with reliable Item ID Extraction)
  const confirmSellerOrder = async () => {
    try {
      // Robust Fallback: If chatData hasn't loaded, parse the itemId directly out of the chatId parameter
      const computedItemId = chatData?.itemId || chatId.split("_")[2];
      
      console.log("Attempting order confirmation for Item ID:", computedItemId);

      if (!computedItemId) {
        console.error("Order completion halted: Item ID missing from chat reference context.");
        alert("Could not locate the Item ID. Please try again.");
        return;
      }

      // Step A: Update Chat Status to complete
      await updateDoc(doc(db, "chats", chatId), {
        status: "completed",
      });

      // Step B: Mark the item inventory reference as Sold Out
      await updateDoc(doc(db, "items", computedItemId), {
        status: "Sold Out"
      });

      // Step C: Push an automated system event log to the timeline track
      await sendSystemMessage("✅ Order Confirmed! The handover transaction is officially complete and the item is marked as Sold Out.");
      
    } catch (error) {
      console.error("Error completing order lifecycle sequence:", error);
      alert("Failed to confirm order execution. Check your browser logs.");
    }
  };

  // SEND MESSAGE
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const targetChatData = chatData || (await getDoc(doc(db, "chats", chatId))).data();
      if (!targetChatData) return;

      const receiverId =
        currentUserId === targetChatData.buyerId
          ? targetChatData.sellerId
          : targetChatData.buyerId;

      await addDoc(collection(db, "chats", chatId, "messages"), {
        text: newMessage,
        senderId: currentUserId,
        createdAt: serverTimestamp(),
      });

      await updateDoc(doc(db, "chats", chatId), {
        lastMessage: newMessage,
        lastMessageTime: serverTimestamp(),
      });

      const userSnap = await getDoc(doc(db, "users", currentUserId));
      const itemSnap = await getDoc(doc(db, "items", targetChatData.itemId));

      await sendChatNotification({
        sellerId: receiverId,
        buyerId: currentUserId,
        itemId: targetChatData.itemId,
        itemTitle: itemSnap.data()?.name || "Item",
        buyerName: userSnap.data()?.username || "Someone",
        chatId,
      });

      setNewMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  // EVALUATE ROLES
  const isBuyer = chatData?.buyerId === currentUserId;
  const isSeller = chatData?.sellerId === currentUserId;
  const currentStatus = chatData?.status || "idle";

  return (
    <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f5f5f5" }}>
      <div style={{ width: "500px", height: "80vh", background: "white", borderRadius: "12px", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", position: "relative" }}>
        
        {/* HEADER AREA */}
        <div style={{ padding: "15px", background: "#007bff", color: "white", fontSize: "20px", fontWeight: "bold", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "16px" }}>Chat</span>
            <span style={{ fontSize: "11px", fontWeight: "normal", opacity: 0.8 }}>Item: {chatData?.itemName || "Loading..."}</span>
          </div>
          
          {/* CONTROL SWITCHES */}
          {isBuyer && currentStatus === "idle" && (
            <button onClick={handleBuyClick} style={{ background: "#20d14c", color: "white", border: "none", padding: "8px 14px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "13px" }}>
              Buy Item
            </button>
          )}

          {isSeller && currentStatus === "buyer_initiated" && (
            <button onClick={confirmSellerOrder} style={{ background: "#20d14c", color: "#ffffff", border: "none", padding: "8px 14px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "13px" }}>
              Confirm Order
            </button>
          )}

          {currentStatus === "completed" && (
            <span style={{ fontSize: "12px", background: "#13e3e3", color: "white", padding: "6px 10px", borderRadius: "4px" }}> Order Confirmed </span>
          )}
        </div>

        {/* TIMELINE TRACK */}
        <div style={{ flex: 1, padding: "15px", overflowY: "auto", background: "#f0f2f5" }}>
          {messages.map((msg) => {
            const isSystem = msg.senderId === "system";
            const isMe = msg.senderId === currentUserId;

            if (isSystem) {
              return (
                <div key={msg.id} style={{ display: "flex", justifyContent: "center", margin: "15px 0" }}>
                  <div style={{ background: "#e2e3e5", color: "#383d41", padding: "8px 12px", borderRadius: "8px", fontSize: "12px", textAlign: "center", maxWidth: "85%" }}>
                    {msg.text}
                  </div>
                </div>
              );
            }

            return (
              <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start", marginBottom: "12px" }}>
                <div style={{ background: isMe ? "#007bff" : "white", color: isMe ? "white" : "black", padding: "10px 14px", borderRadius: "14px", maxWidth: "70%", wordBreak: "break-word", boxShadow: "0 2px 5px rgba(0,0,0,0.08)" }}>
                  {msg.text}
                </div>
                <span style={{ fontSize: "11px", color: "#8e8e93", marginTop: "4px", padding: "0 4px" }}>
                  {formatTime(msg.createdAt)}
                </span>
              </div>
            );
          })}
        </div>

        {/* T&C TERMS OVERLAY */}
        {showTcModal && (
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 10 }}>
            <div style={{ background: "white", width: "85%", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 15px rgba(0,0,0,0.2)" }}>
              <h3 style={{ marginTop: 0, color: "#333" }}>Terms & Conditions</h3>
              <div style={{ fontSize: "13px", color: "#555", lineHeight: "1.5", maxHeight: "200px", overflowY: "auto", marginBottom: "15px", background: "#f8f9fa", padding: "10px", borderRadius: "6px" }}>
                <p style={{ margin: "0 0 8px 0" }}> <strong>1. Spot Inspection:</strong> The buyer needs to check the product on spot during handover.</p>
                <p style={{ margin: "0 0 8px 0" }}> <strong>2. Defect Returns:</strong> If there's a defect then they can return only before the payment is done.</p>
                <p style={{ margin: "0 0 8px 0" }}> <strong>3. Final Settlement:</strong> Once the payment done it can not be returned.</p>
                <p style={{ margin: "0 0 8px 0" }}> <strong>4. Validation Required:</strong> If buyer decides to return then will have to give proper reasons, with a detailed product photo.</p>
                <p style={{ margin: "0" }}> <strong>5. Administration Check:</strong> Admin will take step if there's any fault from the seller's side (Item shown not matched what's delivered).</p>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button onClick={() => setShowTcModal(false)} style={{ background: "#6c757d", color: "white", border: "none", padding: "8px 14px", borderRadius: "6px", cursor: "pointer" }}>Cancel</button>
                <button onClick={confirmBuyOrder} style={{ background: "#efda1e", color: "white", border: "none", padding: "8px 14px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Accept & Buy</button>
              </div>
            </div>
          </div>
        )}

        {/* INPUT BOX */}
        <div style={{ display: "flex", padding: "12px", borderTop: "1px solid #ddd", background: "white" }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type message..."
            style={{ flex: 1, padding: "12px", borderRadius: "25px", border: "1px solid #ccc", outline: "none", fontSize: "15px" }}
          />
          <button onClick={sendMessage} style={{ marginLeft: "10px", padding: "10px 18px", border: "none", borderRadius: "25px", background: "#007bff", color: "white", cursor: "pointer", fontSize: "15px" }}>
            Send
          </button>
        </div>

      </div>
    </div>
  );
}

export default ChatPage;