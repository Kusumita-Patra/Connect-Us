import { useEffect, useState } from "react";
import NotificationDropdown from "./NotificationDropdown";

import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { db } from "../firebase";

const NotificationBell = ({ currentUser }) => {

  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {

    if (!currentUser) return;

    const q = query(
      collection(db, "notifications"),
      where("sellerId", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setNotifications(data);
    });

    return () => unsubscribe();

  }, [currentUser]);

  const unreadCount = notifications.filter(
    (n) => !n.read
  ).length;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 1000,
      }}
    >

      <button
        onClick={() => setOpen(!open)}
        style={{
          fontSize: 17,
          background: "beige",
          padding: "15px",
          borderRadius: "100px",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.26)",
        }}
      >
        🔔 {unreadCount}
      </button>

      {
        open && (
          <NotificationDropdown
            notifications={notifications}
          />
        )
      }

    </div>
  );
};

export default NotificationBell;