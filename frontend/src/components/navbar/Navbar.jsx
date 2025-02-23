import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
// import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/authSlice";
import "./Navbar.css";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showAuthPopover, setShowAuthPopover] = useState(false);
  const [showCategoryPopover, setShowCategoryPopover] = useState(false);
  const authPopoverRef = useRef(null);
  const categoryPopoverRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // List of available categories
  const categories = [
    "Delivery",
    "Contractors",
    "Electricians",
    "Plumbers",
    "Movers",
    "Auto Repair",
    "Parking",
  ];

  // Access user data from Redux
  const { user } = useSelector((state) => state.auth);

  // Logout handler
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
    window.location.reload();
  };

 

  const handleSearch = (e) => {
    if (e) e.preventDefault(); // Only call preventDefault() if e exists

    const params = new URLSearchParams();

    if (selectedCategory) params.set("category", selectedCategory);
    if (searchTerm) params.set("title", searchTerm);
    if (location) params.set("address", location);

    // Only navigate if at least one filter is set
    if ([...params].length > 0) {
      navigate(`/services?${params.toString()}`);
    } else {
      console.warn("No filters selected");
    }
  };

 

  // Handle category selection and trigger search
  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category); // Update category state
    setShowCategoryPopover(false); // Close popover
    handleSearch({ preventDefault: () => {} });
  };

  // UseEffect to trigger search when category changes
  useEffect(() => {
    if (selectedCategory) {
      handleSearch();
    }
  }, [selectedCategory]);

  // Close popovers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        authPopoverRef.current &&
        !authPopoverRef.current.contains(event.target)
      ) {
        setShowAuthPopover(false);
      }
      if (
        categoryPopoverRef.current &&
        !categoryPopoverRef.current.contains(event.target)
      ) {
        setShowCategoryPopover(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="container-fluid navbar navbar-expand-lg bg-white border-bottom sticky-top">
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
          {/* Search Form */}
          <form className="search-container mx-lg-4" onSubmit={handleSearch}>
            <div className="input-group search-input-group">
             
              {/* Search Inputs */}
              <input
                type="text"
                className="form-control search-input"
                placeholder="search by title "
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <input
                type="text"
                className="form-control location-input"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <button className="btn btn-primary search-button" type="submit">
                <Search size={20} />
              </button>
            </div>
          </form>

          {/* Navigation Links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* <li className="nav-item">
              <Link className="nav-link" to="/services">
                Services
              </Link>
            </li> */}

            {/* Categories Popover */}
            <li className="nav-item position-relative" ref={categoryPopoverRef}>
              <button
                className="btn btn-primary btn-rounded"
                onClick={() => setShowCategoryPopover((prev) => !prev)}
              >
                Categories
              </button>
              {showCategoryPopover && (
                <div className="popover-menu category-popover">
                  {categories.map((category, index) => (
                    <button
                      key={index}
                      className="popover-item"
                      onClick={() => handleCategorySelect(category)
                        
                      }
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </li>
          </ul>

          {/* Auth Popover */}
          <div className="d-flex gap-3 position-relative">
            {user ? (
              
              <div className="user-popover-container" ref={authPopoverRef}>
               {user.role === "provider" && (
                      <Link
                        to="/createService"
                        onClick={() => setShowAuthPopover(false)}
                      >
                        Create Service
                      </Link>
                    )}
                <button
                  onClick={() => setShowAuthPopover((prev) => !prev)}
                  className="btn btn-primary btn-rounded btn-username"
                >
                  {user.name}
                </button>
                {showAuthPopover && (
                  <div className="popover-menu">
                    <Link
                      className="popover-item"
                      to="/profile"
                      onClick={() => setShowAuthPopover(false)}
                    >
                      Profile
                    </Link>

                    {user.role !== "provider" && (
                      <Link
                        className="popover-item"
                        to="/Provider"
                        onClick={() => setShowAuthPopover(false)}
                      >
                        Provider
                      </Link>
                    )}
                    {user.role === "provider" && (
                      <Link
                        className="popover-item"
                        to="/createService"
                        onClick={() => setShowAuthPopover(false)}
                      >
                        Create Service
                      </Link>
                    )}
                    <button className="popover-item" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                )}
                
              </div>
              
              
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
    </nav>
  );
};

export default Navbar;
