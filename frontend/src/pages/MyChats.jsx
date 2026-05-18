import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";

import {
  db,
  auth,
} from "../firebase";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

function MyChats() {

  const [chats, setChats] =
    useState([]);

  const navigate =
    useNavigate();

  useEffect(() => {

    if (!auth.currentUser)
      return;

    const q = query(

      collection(db, "chats"),

      where(
        "participants",
        "array-contains",
        auth.currentUser.uid
      ),

      orderBy(
        "lastMessageTime",
        "desc"
      )
    );

    const unsubscribe =
      onSnapshot(q, (snapshot) => {

        const data =
          snapshot.docs.map(
            (doc) => ({

              id: doc.id,

              ...doc.data(),
            })
          );

        setChats(data);
      });

    return () =>
      unsubscribe();

  }, []);

  return (

    <div
      style={{
        padding: "30px",
      }}
    >

      <h1>
        My Chats
      </h1>

      {
        chats.length === 0 ? (

          <p>
            No chats yet
          </p>

        ) : (

          chats.map((chat) => (

            <div
              key={chat.id}

              onClick={() =>
                navigate(
                  `/chat/${chat.id}`
                )
              }

              style={{
                padding: "15px",
                border:
                  "1px solid #ddd",
                borderRadius:
                  "10px",
                marginBottom:
                  "15px",
                cursor: "pointer",
                background:
                  "white",
              }}
            >

              <h3>
                {chat.itemName ||
                  "Item"}
              </h3>

              <p>
                {
                  chat.lastMessage
                }
              </p>

            </div>
          ))
        )
      }

    </div>
  );
}

export default MyChats;