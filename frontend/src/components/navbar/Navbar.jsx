import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { FaRegCalendarCheck } from "react-icons/fa"; // 📅 Importing a booking-style icon
import { MdOutlineCalendarMonth } from "react-icons/md";
import io from "socket.io-client";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import SearchBar from "./SearchBar";
import CategoryPopover from "./CategoryPopover";
import NotificationDropdown from "./NotificationDropdown";
import UserMenu from "./UserMenu";
import { logoutUser } from "../../redux/AuthSlice";
// import CategoryDropdown from "./CategoryDropdown";
import CategoryMenu from "./CategoryMenu";


import "./Navbar.css";

const socket = io(`http://localhost:3000`); // Ensure this matches your backend URL);

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showAuthPopover, setShowAuthPopover] = useState(false);
  const [showCategoryPopover, setShowCategoryPopover] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const authPopoverRef = useRef(null);
  const categoryPopoverRef = useRef(null);
  const notifDropdownRef = useRef(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);



  const fetchNotifications = async () => {
    try {
      console.log("Fetching notifications for user:", user?._id);
      const res = await axios.get(
        `${BASE_URL}/api/notifications/user/${user?._id}`
      );
      const data = res.data;
      console.log("Fetched notifications:", data);
      if (data.success && Array.isArray(data.notifications)) {
        setNotifications(data.notifications);
        setUnreadCount(data.notifications.filter((n) => !n.isRead).length);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await axios.put(
        `${BASE_URL}/api/notifications/markAllAsRead/${user._id}`
      );
      if (res.data.success) {
        const updated = notifications.map((n) => ({ ...n, isRead: true }));
        setNotifications(updated);
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("Error marking notifications as read:", err);
    }
  };

  useEffect(() => {
    if (user) {
      socket.emit("join", user._id);
      socket.on("newNotification", (newNotif) => {
        setNotifications((prev) => [newNotif, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });
      fetchNotifications();
    }
    return () => {
      socket.off("newNotification");
    };
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
    window.location.reload();
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (selectedCategory) params.set("category", selectedCategory);
    if (searchTerm) params.set("title", searchTerm);
    if (location) params.set("address", location);
    if ([...params].length > 0) navigate(`/services?${params.toString()}`);
  };

  // const handleCategorySelect = (category) => {
  //   setSelectedCategory(category);
  //   setShowCategoryPopover(false);
  //   handleSearch({ preventDefault: () => {} });
  // };


  // Update handleCategorySelect in Navbar component
const handleCategorySelect = (category) => {
  setSelectedCategory(category);
  setShowCategoryPopover(false);
  
  // Immediately trigger search with selected category
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (searchTerm) params.set("title", searchTerm);
  if (location) params.set("address", location);
  navigate(`/services?${params.toString()}`);
};



  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        authPopoverRef.current &&
        !authPopoverRef.current.contains(event.target)
      )
        setShowAuthPopover(false);
      if (
        categoryPopoverRef.current &&
        !categoryPopoverRef.current.contains(event.target)
      )
        setShowCategoryPopover(false);
      if (
        notifDropdownRef.current &&
        !notifDropdownRef.current.contains(event.target)
      )
        setShowNotifDropdown(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav
        style={{ display: "block" }}
        className="container-fluid navbar navbar-expand-lg bg-white border-bottom sticky-top"
      >
        <div className="container-fluid px-4">
          <Link className="navbar-brand" to="/">
            <img src="/image/loogo.jpg" alt="ServiceHub" />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarContent">
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              location={location}
              setLocation={setLocation}
              handleSearch={handleSearch}
            />

            {/* <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <CategoryPopover
              showCategoryPopover={showCategoryPopover}
              setShowCategoryPopover={setShowCategoryPopover}
              categories={categories}
              handleCategorySelect={handleCategorySelect}
              categoryPopoverRef={categoryPopoverRef}
            />
          </ul> */}

            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  to="/services"
                  className="btn btn-primary btn-rounded booking-btn d-flex align-items-center gap-2"
                >
                  <MdOutlineCalendarMonth size={22} />
                  {/* Booking Page */}
                </Link>
              </li>
            </ul>

            <div className="d-flex gap-3 position-relative">
              {user ? (
                <>
                  {/* <NotificationDropdown
                    unreadCount={unreadCount}
                    notifications={notifications}
                    showNotifDropdown={showNotifDropdown}
                    setShowNotifDropdown={setShowNotifDropdown}
                    markAllAsRead={markAllAsRead}
                    notifDropdownRef={notifDropdownRef}
                  /> */}
                  <NotificationDropdown
  unreadCount={unreadCount}
  notifications={notifications}
  showNotifDropdown={showNotifDropdown}
  setShowNotifDropdown={setShowNotifDropdown}
  markAllAsRead={markAllAsRead}
  notifDropdownRef={notifDropdownRef}
/>

                  <UserMenu
                    user={user}
                    setShowAuthPopover={setShowAuthPopover}
                    showAuthPopover={showAuthPopover}
                    handleLogout={handleLogout}
                    authPopoverRef={authPopoverRef}
                  />
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-primary">
                    Log In
                  </Link>
                  <Link to="/signup" className="btn btn-primary">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* insdie the navbar */}
        {/* <ul className="navbar-nav me-auto mb-2 mb-lg-0"> */}
        <CategoryMenu
          showCategoryPopover={showCategoryPopover}
          setShowCategoryPopover={setShowCategoryPopover}
          handleCategorySelect={handleCategorySelect}
          categoryPopoverRef={categoryPopoverRef}
        />
        {/* </ul> */}
      </nav>
    </>
  );
};

export default Navbar;
