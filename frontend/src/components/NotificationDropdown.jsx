import {
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase";

const NotificationDropdown = ({ notifications }) => {

  const markAsRead = async (id) => {

    try {

      await updateDoc(
        doc(db, "notifications", id),
        {
          read: true,
        }
      );

    } catch (error) {
      console.log(error);
    }
  };

  return (

    <div
      style={{
        width: "300px",
        background: "white",
        borderRadius: "10px",
        marginTop: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.2)",
        overflow: "hidden",
      }}
    >

      {
        notifications.length === 0 ? (

          <p
            style={{
              padding: "15px",
              textAlign: "center",
            }}
          >
            No notifications
          </p>

        ) : (

          notifications.map((notification) => (

            <div
              key={notification.id}
              onClick={() => markAsRead(notification.id)}
              style={{
                padding: "12px",
                borderBottom: "1px solid #eee",
                cursor: "pointer",
                backgroundColor: notification.read
                  ? "white"
                  : "#e6f0ff",
              }}
            >

              <p
                style={{
                  margin: 0,
                }}
              >
                {notification.message}
              </p>

            </div>

          ))
        )
      }

    </div>
  );
};

export default NotificationDropdown;