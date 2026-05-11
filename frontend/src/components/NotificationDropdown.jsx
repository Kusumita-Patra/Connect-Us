import {
  doc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "../firebase";

import {
  useNavigate,
} from "react-router-dom";

const NotificationDropdown = ({
  notifications,
}) => {

  const navigate =
    useNavigate();

  const openNotification =
    async (notification) => {

      try {

        // DELETE FIRST

        await deleteDoc(
          doc(
            db,
            "notifications",
            notification.id
          )
        );

        // THEN NAVIGATE

        navigate(
          `/chat/${notification.chatId}`
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
        boxShadow:
          "0 0 10px rgba(0,0,0,0.2)",
        overflow: "hidden",
      }}
    >

      {notifications.length === 0 ? (

        <p
          style={{
            padding: "15px",
            textAlign: "center",
          }}
        >
          No notifications
        </p>

      ) : (

        notifications.map(
          (notification) => (

            <div
              key={notification.id}

              onClick={() =>
                openNotification(
                  notification
                )
              }

              style={{
                padding: "12px",
                borderBottom:
                  "1px solid #eee",
                cursor: "pointer",
                backgroundColor:
                  "#e6f0ff",
              }}
            >

              {notification.message}

            </div>
          )
        )
      )}

    </div>
  );
};

export default NotificationDropdown;