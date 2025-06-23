// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import { Container, Row, Spinner } from "react-bootstrap";
// import BookingCard from "./BookingCard";
// import BookingDetailsModal from "./BookingDetailsModal";
// import Providerbooking from "../service-providers/ProviderBookings";
// import "./bookings.css";
// import { Link } from "react-router-dom";
// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const MyBookings = () => {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const { user } = useSelector((state) => state.auth);

//   useEffect(() => {
//     if (!user) return;

//     const fetchBookings = async () => {
//       try {
//         const response = await axios.get(`${BASE_URL}/api/bookings/user/${user._id}`);
//         setBookings(response.data.data);
//       } catch (error) {
//         console.error("Error fetching bookings:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookings();
//   }, [user]);

//   const handleCancelClick = (bookingId) => {
//     setSelectedBooking(bookings.find((b) => b._id === bookingId));
//     setShowModal(true);
//   };

//   const handleConfirmCancel = async () => {
//     try {
//       await axios.delete(`${BASE_URL}/api/bookings/${selectedBooking._id}`);
//       setBookings((prev) => prev.filter((b) => b._id !== selectedBooking._id));
//     } catch (error) {
//       console.error("Cancellation failed:", error);
//     } finally {
//       setShowModal(false);
//     }
//   };

//   const handleDetailsClick = (booking) => {
//     setSelectedBooking(booking);
//     setShowModal(true);
//   };

//   return (
//     <Container fluid className="my-5">
//       <h4 className="fw-bold px-2 px-sm-4 mb-4">My Bookings</h4>

//       {loading ? (
//         <div className="text-center my-5">
//           <Spinner animation="border" className="text-primary" />
//           <p className="mt-2">Fetching bookings...</p>
//         </div>
//       ) : bookings.length === 0 ? (
//         <div className="text-center text-muted my-5">
//           <h4>No bookings found</h4>
//           <p>Try booking a service.</p>
//           <Link to="/services" className="btn btn-primary">
//   Browse Services
// </Link>
//         </div>
//       ) : (
//         <Row className="g-4 px-2 px-sm-4">
//           {bookings.map((booking) => (
//             <BookingCard
//               key={booking._id}
//               booking={booking}
//               onCancelClick={handleCancelClick}
//               onDetailsClick={handleDetailsClick}
//             />
//           ))}
//         </Row>
//       )}

//       <BookingDetailsModal
//         show={showModal && selectedBooking}
//         booking={selectedBooking}
//         onClose={() => setShowModal(false)}
//         onCancelConfirm={handleConfirmCancel}
//       />
//     </Container>
//   );
// };

// export default MyBookings;


import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Container, Row, Spinner, Button, ButtonGroup } from "react-bootstrap";
import BookingCard from "./BookingCard";
import BookingDetailsModal from "./BookingDetailsModal";
import ProviderBooking from "../service-providers/ProviderBookings";
import "./bookings.css";
import { Link } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MyBookings = () => {
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [viewMode, setViewMode] = useState("user"); // 'user' or 'provider'
  const { user } = useSelector((state) => state.auth);

  // Separate state for provider bookings
  const [providerBookings, setProviderBookings] = useState([]);
  const [providerLoading, setProviderLoading] = useState(false);

  // Fetch user bookings
  const fetchUserBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/bookings/user/${user._id}`);
      setUserBookings(response.data.data);
    } catch (error) {
      console.error("Error fetching user bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch provider bookings
  const fetchProviderBookings = async () => {
    try {
      setProviderLoading(true);
      const response = await axios.get(`${BASE_URL}/api/bookings/provider/${user._id}`);
      setProviderBookings(response.data.data);
    } catch (error) {
      console.error("Error fetching provider bookings:", error);
    } finally {
      setProviderLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    
    if (viewMode === "user") {
      fetchUserBookings();
    } else {
      fetchProviderBookings();
    }
  }, [user, viewMode]);

  const handleCancelClick = (bookingId) => {
    const bookingsToSearch = viewMode === "user" ? userBookings : providerBookings;
    setSelectedBooking(bookingsToSearch.find((b) => b._id === bookingId));
    setShowModal(true);
  };

  const handleConfirmCancel = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/bookings/${selectedBooking._id}`);
      if (viewMode === "user") {
        setUserBookings((prev) => prev.filter((b) => b._id !== selectedBooking._id));
      } else {
        setProviderBookings((prev) => prev.filter((b) => b._id !== selectedBooking._id));
      }
    } catch (error) {
      console.error("Cancellation failed:", error);
    } finally {
      setShowModal(false);
    }
  };

  const handleDetailsClick = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  return (
    <Container fluid className="my-bookings-container">
      <div className="bookings-header">
        <h2 className="bookings-title">My Bookings</h2>
        <ButtonGroup className="view-toggle">
          <Button
            variant={viewMode === "user" ? "primary" : "outline-primary"}
            onClick={() => setViewMode("user")}
            className="view-toggle-btn"
          >
            My Bookings
          </Button>
          <Button
            variant={viewMode === "provider" ? "primary" : "outline-primary"}
            onClick={() => setViewMode("provider")}
            className="view-toggle-btn"
          >
            customer Bookings
          </Button>
        </ButtonGroup>
      </div>

      {viewMode === "provider" ? (
        <ProviderBooking 
          bookings={providerBookings} 
          loading={providerLoading}
          onCancelClick={handleCancelClick}
          onDetailsClick={handleDetailsClick}
        />
      ) : loading ? (
        <div className="loading-state">
          <Spinner animation="border" className="text-primary" />
          <p className="loading-text">Fetching your bookings...</p>
        </div>
      ) : userBookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-content">
            <h4>No bookings found</h4>
            <p>You haven't made any bookings yet</p>
            <Link to="/services" className="btn btn-primary browse-btn">
              Browse Services
            </Link>
          </div>
        </div>
      ) : (
        <Row className="bookings-grid">
          {userBookings.map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              onCancelClick={handleCancelClick}
              onDetailsClick={handleDetailsClick}
            />
          ))}
        </Row>
      )}

      <BookingDetailsModal
        show={showModal && selectedBooking}
        booking={selectedBooking}
        onClose={() => setShowModal(false)}
        onCancelConfirm={handleConfirmCancel}
      />
    </Container>
  );
};

export default MyBookings;