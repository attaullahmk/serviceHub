import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Spinner,
  Card,
} from "react-bootstrap";
import axios from "axios";
import "./BookingForm.css";
import { useSelector } from "react-redux";

const BookingForm = ({ service }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [bookingDate, setBookingDate] = useState("");
  const [totalPrice, setTotalPrice] = useState(service.service.price);
  const [specialRequests, setSpecialRequests] = useState(""); // ✅ new state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:3000/api/bookings", {
        user: user._id,
        service: service.service._id,
        provider: service.service.provider._id,
        bookingDate,
        totalPrice,
        specialRequests, // ✅ included in payload
      });

      setSuccess("Booking successful!");
      setTimeout(() => navigate("/bookings"), 2000);
    } catch (err) {
      setError("You have already booked this service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center my-5">
      <Card
        className="booking-card shadow-lg p-4 w-100"
        style={{ maxWidth: "500px", borderRadius: "20px" }}
      >
        <h3 className="text-center mb-4 fw-bold">Book Service</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="bookingDate" className="mb-4">
            <Form.Label className="fw-semibold">Select Date</Form.Label>
            <Form.Control
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              required
              className="form-control-lg rounded-3"
            />
          </Form.Group>

          <Form.Group controlId="totalPrice" className="mb-4">
            <Form.Label className="fw-semibold">Total Price</Form.Label>
            <Form.Control
              type="number"
              value={totalPrice}
              onChange={(e) => setTotalPrice(e.target.value)}
              className="form-control-lg rounded-3"
            />
          </Form.Group>

          {/* ✅ Special Requests Field */}
          <Form.Group controlId="specialRequests" className="mb-4">
            <Form.Label className="fw-semibold">Special Requests (optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Any specific instructions?"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className="form-control-lg rounded-3"
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100 py-2 rounded-pill"
            disabled={loading}
          >
            {loading ? (
              <Spinner as="span" animation="border" size="sm" />
            ) : (
              "Book Now"
            )}
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default BookingForm;
