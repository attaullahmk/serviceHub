import { Modal, Button } from "react-bootstrap";

const BookingDetailsModal = ({ show, booking, onClose, onCancelConfirm }) => {
  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("en-US");

  if (!booking) return null;

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {booking.status === "canceled" ? "Booking Canceled" : "Booking Details"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-muted">Complete information about your booking</p>
        <p><strong>Service:</strong> {booking.service.title}</p>
        <p><strong>Provider:</strong> {booking.provider.name}</p>
        <p><strong>Date:</strong> {formatDate(booking.bookingDate)}</p>
        <p><strong>Status:</strong> <span className="badge bg-success-subtle text-success">{booking.status}</span></p>
        <p><strong>Payment:</strong> <span className="badge bg-success-subtle text-success">{booking.paymentStatus}</span></p>
        <p><strong>Price:</strong> PKR {booking.totalPrice.toFixed(2)}</p>
        <p><strong>Booked on:</strong> {formatDate(booking.createdAt)}</p>
        {booking.specialRequests && (
          <p><strong>Special Requests:</strong> {booking.specialRequests}</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Close</Button>
        <Button variant="danger" onClick={onCancelConfirm}>Cancel Booking</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BookingDetailsModal;
