import { Link } from "react-router-dom";

const UserMenu = ({ user, setShowAuthPopover, showAuthPopover, handleLogout, authPopoverRef }) => (
  <div className="user-popover-container" ref={authPopoverRef}>
    {/* {user.role === "provider" && (
      <Link to="/createService" onClick={() => setShowAuthPopover(false)}>
        Create Service
      </Link>
    )} */}
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
        <button className="popover-item" onClick={handleLogout}>Logout</button>
      </div>
    )}
  </div>
);

export default UserMenu;
