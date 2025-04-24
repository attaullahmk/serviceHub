import { FiBell } from "react-icons/fi";

const NotificationDropdown = ({ unreadCount, notifications, showNotifDropdown, setShowNotifDropdown, markAllAsRead, notifDropdownRef }) => (
  <div className="position-relative d-inline-block" style={{ marginTop: "4px" }}>
    <FiBell
      size={24}
      className="mx-3 text-primary"
      style={{ cursor: "pointer" }}
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
