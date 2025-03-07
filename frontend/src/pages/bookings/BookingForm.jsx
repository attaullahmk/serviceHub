import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import "./BookingForm.css";
import { useSelector } from "react-redux";

const BookingForm = ({ service }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [bookingDate, setBookingDate] = useState("");
  console.log(service.service.price)
  const [totalPrice, setTotalPrice] = useState(service.service.price);
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
      });

      setSuccess("Booking successful!");
      setTimeout(() => navigate("/bookings"), 2000);
    } catch (err) {
      setError("Failed to book service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="booking-form-container my-4">
      <Row className="justify-content-center">
        <Col md={6} className="shadow-lg p-4 bg-white rounded">
          <h2 className="text-center">Book Service</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="bookingDate" className="mb-3">
              <Form.Label>Select Date</Form.Label>
              <Form.Control
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="totalPrice" className="mb-3">
              <Form.Label>Total Price</Form.Label>
              <Form.Control
                type="number"
                value={totalPrice}
                readOnly
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? <Spinner as="span" animation="border" size="sm" /> : "Confirm Booking"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default BookingForm;
