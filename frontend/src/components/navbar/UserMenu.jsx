import { Link } from "react-router-dom";
import { FiLogOut } from "react-icons/fi"; // ✅ Logout Icon
import "./UserMenu.css"; // ✅ We'll add a little custom CSS

const UserMenu = ({ user, setShowAuthPopover, showAuthPopover, handleLogout, authPopoverRef }) => (
  <div className="user-popover-container" ref={authPopoverRef}>
    <button
      onClick={() => setShowAuthPopover(prev => !prev)}
      className="btn btn-primary btn-rounded btn-username"
    >
      {user.name}
    </button>

    {showAuthPopover && (
      <div className="popover-menu">
        <Link className="popover-item" to="/profile" onClick={() => setShowAuthPopover(false)}>Profile</Link>
        <Link className="popover-item" to="/bookings" onClick={() => setShowAuthPopover(false)}>Bookings</Link>

        {user.role !== "provider" && (
          <Link className="popover-item" to="/Provider" onClick={() => setShowAuthPopover(false)}>Provider</Link>
        )}

        {user.role === "provider" && (
          <>
            <Link className="popover-item" to="/createService" onClick={() => setShowAuthPopover(false)}>Create Service</Link>
            <Link className="popover-item" to="/provider/dashboard" onClick={() => setShowAuthPopover(false)}>Dashboard</Link>
          </>
        )}

        {/* ✅ Logout button with icon */}
        <button className="popover-item logout-btn" onClick={handleLogout}>
          <FiLogOut size={18} style={{ marginRight: "8px" }} />
          Logout
        </button>
      </div>
    )}
  </div>
);

export default UserMenu;
