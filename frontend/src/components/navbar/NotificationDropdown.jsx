import { FiBell } from "react-icons/fi";
// import "./NoftificationDropdown.css";

const NotificationDropdown = ({ unreadCount, notifications, showNotifDropdown, setShowNotifDropdown, markAllAsRead, notifDropdownRef }) => (
  <div className="position-relative d-inline-block" style={{ marginTop: "4px" }}>
    <FiBell
      size={24}
      className=" text-primary"
      style={{ cursor: "pointer" ,
        marginRight: "0rem",
        marginLeft: "1rem",
      }}
      onClick={() => {
        const next = !showNotifDropdown;
        setShowNotifDropdown(next);
        if (next) markAllAsRead();
      }}
    />
    {unreadCount > 0 && (
      <span className="notification-count">{unreadCount}</span>
    )}
    {showNotifDropdown && (
      <div
        ref={notifDropdownRef}
        className="notification-dropdown"
        style={{
          position: "absolute",
          top: "30px",
          right: "0",
          backgroundColor: "#fff",
          border: "1px solid #ddd",
          borderRadius: "4px",
          width: "300px",
          zIndex: 1000,
          maxHeight: "300px",
          overflowY: "auto",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
        }}
      >
        {notifications.length === 0 ? (
          <p className="p-2 text-center">No notifications</p>
        ) : (
          notifications.map((notif, index) => (
            <div
              key={index}
              className="p-2 border-bottom d-flex justify-content-between align-items-center"
              style={{
                backgroundColor: notif.isRead ? "#fff" : "#f0f8ff",
                fontWeight: notif.isRead ? "normal" : "bold"
              }}
            >
              <span>{notif.message}</span>
              {!notif.isRead && (
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "red",
                    display: "inline-block",
                    marginLeft: "10px"
                  }}
                />
              )}
            </div>
          ))
        )}
      </div>
    )}
  </div>
);

export default NotificationDropdown;



// import { useEffect, useState } from "react";
// import { FiBell } from "react-icons/fi";
// import { Link } from "react-router-dom";
// import socket from "../../socket";
// import "./NotificationDropdown.css";

// const NotificationDropdown = ({
//   unreadCount,
//   notifications,
//   setNotifications,
//   showNotifDropdown,
//   setShowNotifDropdown,
//   markAllAsRead,
//   notifDropdownRef,
// }) => {
//   // Handle real-time notifications
//   useEffect(() => {
//     socket.on("newNotification", (newNotif) => {
//       setNotifications((prevNotifications) => [newNotif, ...prevNotifications]);
//     });

//     // Clean up the event listener on unmount
//     return () => socket.off("newNotification");
//   }, [setNotifications]);

//   return (
//     <div className="notification-container">
//       <FiBell
//         className="notification-icon"
//         onClick={() => {
//           const next = !showNotifDropdown;
//           setShowNotifDropdown(next);
//           if (next) markAllAsRead();
//         }}
//       />
//       {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
//       {showNotifDropdown && (
//         <div ref={notifDropdownRef} className="notification-dropdown">
//           {notifications.length === 0 ? (
//             <p className="notification-empty">No notifications</p>
//           ) : (
//             notifications.map((notif, index) => {
//               let targetUrl = "/";
//               if (notif.targetType === "booking") targetUrl = `/bookings/${notif.targetId}`;
//               else if (notif.targetType === "service") targetUrl = `/services/${notif.targetId}`;
//               else if (notif.targetType === "profile") targetUrl = `/users/${notif.targetId}`;
//               else if (notif.targetType === "review") targetUrl = `/reviews/${notif.targetId}`;
//               else if (notif.targetType === "message") targetUrl = `/reviews/${notif.targetId}`;

//               return (
//                 <Link
//                   key={notif._id || index}
//                   to={targetUrl}
//                   className={`notification-item ${!notif.isRead ? "unread" : ""}`}
//                   onClick={() => setShowNotifDropdown(false)}
//                 >
//                   <span className="notification-message">{notif.message}</span>
//                   {!notif.isRead && <span className="notification-indicator" />}
//                 </Link>
//               );
//             })
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationDropdown;


// import { useEffect, useState } from "react";
// import { FiBell } from "react-icons/fi";
// import { Link } from "react-router-dom";
// import socket from "../../socket";
// import "./NotificationDropdown.css";

// const NotificationDropdown = ({
//   unreadCount,
//   notifications,
//   setNotifications,
//   showNotifDropdown,
//   setShowNotifDropdown,
//   markAllAsRead,
//   notifDropdownRef,
// }) => {
//   // Handle real-time notifications
//   useEffect(() => {
//     socket.on("newNotification", (newNotif) => {
//       setNotifications((prevNotifications) => [newNotif, ...prevNotifications]);
//     });

//     // Clean up the event listener on unmount
//     return () => socket.off("newNotification");
//   }, [setNotifications]);
//   console.log("notifications", notifications);

//   return (
//     <div className="notification-container">
//       <FiBell
//         className="notification-icon"
//         onClick={() => {
//           const next = !showNotifDropdown;
//           setShowNotifDropdown(next);
//           if (next) markAllAsRead();
//         }}
//       />
//       {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
//       {showNotifDropdown && (
//         <div ref={notifDropdownRef} className="notification-dropdown">
//           {notifications.length === 0 ? (
//             <p className="notification-empty">No notifications</p>
//           ) : (
//             notifications.map((notif, index) => {
//               let targetUrl = "/";
//               // if (notif.targetType === "booking") targetUrl = `/bookings/${notif.targetId}`;
//               if (notif.targetType === "booking") targetUrl = `/services/${notif.targetId}`;
//               else if (notif.targetType === "service") targetUrl = `/services/${notif.targetId}`;
//               else if (notif.targetType === "profile") targetUrl = `/users/${notif.targetId}`;
//               else if (notif.targetType === "review") targetUrl = `/reviews/${notif.targetId}`;
//               else if (notif.targetType === "message") targetUrl = `/services/${notif.targetId}`;

//               return (
//                 <Link
//                   key={notif._id || index}
//                   to={targetUrl}
//                   className={`notification-item ${!notif.isRead ? "unread" : ""}`}
//                   onClick={() => setShowNotifDropdown(false)}
//                 >
//                   <span className="notification-message">{notif.message}</span>
//                   {!notif.isRead && <span className="notification-indicator" />}
//                 </Link>
//               );
//             })
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationDropdown;
