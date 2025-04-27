import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Container, Row, Spinner } from "react-bootstrap";
import BookingCard from "./BookingCard";
import BookingDetailsModal from "./BookingDetailsModal";
import "./bookings.css";
import { Link } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) return;

    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/bookings/user/${user._id}`);
        setBookings(response.data.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const handleCancelClick = (bookingId) => {
    setSelectedBooking(bookings.find((b) => b._id === bookingId));
    setShowModal(true);
  };

  const handleConfirmCancel = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/bookings/${selectedBooking._id}`);
      setBookings((prev) => prev.filter((b) => b._id !== selectedBooking._id));
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
    <Container fluid className="my-5">
      <h4 className="fw-bold px-2 px-sm-4 mb-4">My Bookings</h4>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" className="text-primary" />
          <p className="mt-2">Fetching bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center text-muted my-5">
          <h4>No bookings found</h4>
          <p>Try booking a service.</p>
          <Link to="/services" className="btn btn-primary">
  Browse Services
</Link>
        </div>
      ) : (
        <Row className="g-4 px-2 px-sm-4">
          {bookings.map((booking) => (
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
