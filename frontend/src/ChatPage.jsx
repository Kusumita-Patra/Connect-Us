import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

import { db, auth } from "./firebase";

function ChatPage() {
  const { chatId } = useParams();

  const [messages, setMessages] = useState([]);

  const [newMessage, setNewMessage] = useState("");

  // LOAD MESSAGES

  useEffect(() => {
    const q = query(
      collection(db, "chats", chatId, "messages"),

      orderBy("createdAt"),
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

  // SEND MESSAGE

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await addDoc(
        collection(db, "chats", chatId, "messages"),

        {
          text: newMessage,

          senderId: auth.currentUser.uid,

          createdAt: serverTimestamp(),
        },
      );

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

        boxShadow:
          "0 4px 12px rgba(0,0,0,0.1)",

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

        {messages.map(msg => (

          <div
            key={msg.id}
            style={{

              display: "flex",

              justifyContent:
                msg.senderId ===
                auth.currentUser.uid
                  ? "flex-end"
                  : "flex-start",

              marginBottom: "12px",

            }}
          >

            <div
              style={{

                background:
                  msg.senderId ===
                  auth.currentUser.uid
                    ? "#007bff"
                    : "white",

                color:
                  msg.senderId ===
                  auth.currentUser.uid
                    ? "white"
                    : "black",

                padding:
                  "10px 14px",

                borderRadius: "14px",

                maxWidth: "70%",

                wordBreak:
                  "break-word",

                boxShadow:
                  "0 2px 5px rgba(0,0,0,0.08)",

              }}
            >

              {msg.text}

            </div>

          </div>

        ))}

      </div>

      {/* INPUT AREA */}

      <div
        style={{

          display: "flex",

          padding: "12px",

          borderTop:
            "1px solid #ddd",

          background: "white",

        }}
      >

        <input
          type="text"
          value={newMessage}
          onChange={(e) =>
            setNewMessage(
              e.target.value
            )
          }
          placeholder="Type message..."
          style={{

            flex: 1,

            padding: "12px",

            borderRadius: "25px",

            border:
              "1px solid #ccc",

            outline: "none",

            fontSize: "15px",

          }}
        />

        <button
          onClick={sendMessage}
          style={{

            marginLeft: "10px",

            padding:
              "10px 18px",

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
