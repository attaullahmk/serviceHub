import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Container, Row, Col, Button, Spinner, Modal } from "react-bootstrap";
import {
  FaCalendarAlt,
  FaClock,
  FaDollarSign,
  FaInfoCircle,
} from "react-icons/fa";

const ProviderBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) return;

    const fetchProviderBookings = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/bookings/provider/${user._id}`
        );
        setBookings(response.data.data);
        console.log("Provider Bookings:", response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching provider bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    console.log(bookings);
    console.log("this is bookings");
    fetchProviderBookings();
  }, [user]);

  const handleDetailsClick = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("en-US");

  return (
    <Container fluid className="my-5">
      <h4 className="fw-bold px-2 px-sm-4 mb-4">Service Bookings</h4>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" className="text-primary" />
          <p className="mt-2">Fetching bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center text-muted my-5">
          <h4>No bookings received</h4>
          <p>You haven’t received any bookings yet.</p>
        </div>
      ) : (
        <Row className="g-4 px-2 px-sm-4">
          {bookings.map((booking) => (
            <Col key={booking._id} xs={12} sm={6} md={6} lg={4} xl={3}>
              <div className="border rounded shadow-sm overflow-hidden position-relative p-3 bg-white h-100">
                <div
                  className={`position-absolute top-0 end-0 m-2 px-2 py-1 rounded-pill small fw-semibold ${
                    booking.status === "confirmed"
                      ? "bg-success-subtle text-success"
                      : booking.status === "pending"
                      ? "bg-warning-subtle text-warning"
                      : "bg-danger-subtle text-danger"
                  }`}
                >
                  {booking.status.charAt(0).toUpperCase() +
                    booking.status.slice(1)}
                </div>

                <div
                  className="bg-light text-center mb-3"
                  style={{ height: "160px" }}
                >
                  <img
                    src={
                      booking.service?.imageGallery?.[0] || "/default-image.jpg"
                    }
                    alt={booking.service?.title || "Service"}
                    className="img-fluid h-100 object-fit-contain"
                  />
                </div>

                <h6 className="fw-bold text-truncate">
                  {booking.service?.title || "No Title"}
                </h6>

                <div className="small mb-1">
                  <FaCalendarAlt className="me-2" />
                  {formatDate(booking.bookingDate)}
                </div>
                <div className="small mb-1">
                  <FaClock className="me-2" />
                  05:00 AM
                </div>
                <div className="small mb-2">
                  <FaDollarSign className="me-2" />
                  PKR {booking.totalPrice.toFixed(2)}
                </div>

                <div className="d-flex justify-content-between align-items-center mt-3">
                  <Button
                    variant="light"
                    size="sm"
                    onClick={() => handleDetailsClick(booking)}
                  >
                    <FaInfoCircle className="me-1" /> Details
                  </Button>
                </div>

                {/* ✅ Accept/Reject Buttons for Pending Bookings */}
                {booking.status === "pending" && (
                  <div className="d-flex gap-2 mt-2">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={async () => {
                        try {
                          await axios.patch(
                            `http://localhost:3000/api/bookings/${booking._id}/status`,
                            { status: "confirmed" }
                          );
                          setBookings((prev) =>
                            prev.map((b) =>
                              b._id === booking._id
                                ? { ...b, status: "confirmed" }
                                : b
                            )
                          );
                        } catch (err) {
                          console.error("Error confirming booking:", err);
                        }
                      }}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={async () => {
                        try {
                          await axios.patch(
                            `http://localhost:3000/api/bookings/${booking._id}/status`,
                            { status: "canceled" }
                          );
                          setBookings((prev) =>
                            prev.map((b) =>
                              b._id === booking._id
                                ? { ...b, status: "cancelled" }
                                : b
                            )
                          );
                        } catch (err) {
                          console.error("Error cancelling booking:", err);
                        }
                      }}
                    >
                      Reject
                    </Button>
                  </div>
                )}

                {booking.paymentStatus === "paid" && (
                  <span className="position-absolute bottom-0 end-0 m-2 small bg-success-subtle text-success px-2 py-1 rounded-pill">
                    Paid
                  </span>
                )}
              </div>
            </Col>
          ))}
        </Row>
      )}

      {/* Booking Detail Modal */}
      <Modal
        show={showModal && selectedBooking}
        onHide={() => setShowModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Booking Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBooking && (
            <>
              <p className="text-muted">Client booking information</p>
              <p>
                <strong>Service:</strong> {selectedBooking.service.title}
              </p>
              <p>
                <strong>Client:</strong> {selectedBooking.user.name}
              </p>
              <p>
                <strong>Date:</strong> {formatDate(selectedBooking.bookingDate)}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="badge bg-success-subtle text-success">
                  {selectedBooking.status.charAt(0).toUpperCase() +
                    selectedBooking.status.slice(1)}
                </span>
              </p>
              <p>
                <strong>Payment:</strong>{" "}
                <span className="badge bg-success-subtle text-success">
                  {selectedBooking.paymentStatus.charAt(0).toUpperCase() +
                    selectedBooking.paymentStatus.slice(1)}
                </span>
              </p>
              <p>
                <strong>Price:</strong> PKR{" "}
                {selectedBooking.totalPrice.toFixed(2)}
              </p>
              <p>
                <strong>Booked on:</strong>{" "}
                {formatDate(selectedBooking.createdAt)}
              </p>
              {selectedBooking.specialRequests && (
                <p>
                  <strong>Special Requests:</strong>{" "}
                  {selectedBooking.specialRequests}
                </p>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProviderBookings;
