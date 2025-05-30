import { Link } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { useEffect, useState } from "react";
import axios from "axios";
import "./UserMenu.css";


const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const UserMenu = ({ user, setShowAuthPopover, showAuthPopover, handleLogout, authPopoverRef }) => {
    const [profilePic, setProfilePic] = useState(null);
        const [profile, setProfile] = useState(null);
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/userProfiles/${user._id}`);
                setProfile(response.data.profile);
              
                // setFormData(response.data.profile);
            } catch (err) {
                // setError("Failed to load profile");
                console.error("Error fetching profile:", err);
            } 
        };
        if (user && user._id) fetchProfile();
    }, [user]);

    // useEffect(() => {
    //     const fetchProfilePicture = async () => {
    //         try {
    //             const response = await axios.get(`${BASE_URL}/api/userProfiles/${user._id}`);
    //             const { picture } = response.data;
    //             if (picture) setProfilePic(picture);
    //         } catch (error) {
    //             console.error("Failed to fetch profile picture", error);
    //         }
    //     };

    //     if (user._id) fetchProfilePicture();
    // }, [user._id]);
console.log("Profile picture URL:", profile);
    return (
        <div className="user-popover-container"   data-username={user.name.slice(0, 7)} ref={authPopoverRef}>
  <button
    onClick={() => setShowAuthPopover(prev => !prev)}
    className="btn-username"
    data-username={user.name.slice(0, 7)}
>
    {profile ? (
        <img src={profile.profilePicture} alt="Profile" className="profile-pic" />
    ) : (
        user.name.slice(0, 7)
    )}
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

                    <button className="popover-item logout-btn" onClick={handleLogout}>
                        <FiLogOut size={18} style={{ marginRight: "8px" }} />
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserMenu;





// import { Link } from "react-router-dom";
// import { FiLogOut } from "react-icons/fi"; // ✅ Logout Icon
// import "./UserMenu.css"; // ✅ We'll add a little custom CSS

// const UserMenu = ({ user, setShowAuthPopover, showAuthPopover, handleLogout, authPopoverRef }) => (
//   <div className="user-popover-container" ref={authPopoverRef}>
//     <button
//       onClick={() => setShowAuthPopover(prev => !prev)}
//       className="btn btn-primary btn-rounded btn-username"
//     >
//       {user.name}


//     </button>

//     {showAuthPopover && (
//       <div className="popover-menu">
//         <Link className="popover-item" to="/profile" onClick={() => setShowAuthPopover(false)}>Profile</Link>
//         <Link className="popover-item" to="/bookings" onClick={() => setShowAuthPopover(false)}>Bookings</Link>

//         {user.role !== "provider" && (
//           <Link className="popover-item" to="/Provider" onClick={() => setShowAuthPopover(false)}>Provider</Link>
//         )}

//         {user.role === "provider" && (
//           <>
//             <Link className="popover-item" to="/createService" onClick={() => setShowAuthPopover(false)}>Create Service</Link>
//             <Link className="popover-item" to="/provider/dashboard" onClick={() => setShowAuthPopover(false)}>Dashboard</Link>
//           </>
//         )}

//         {/* ✅ Logout button with icon */}
//         <button className="popover-item logout-btn" onClick={handleLogout}>
//           <FiLogOut size={18} style={{ marginRight: "8px" }} />
//           Logout
//         </button>
//       </div>
//     )}
//   </div>
// );

// export default UserMenu;
