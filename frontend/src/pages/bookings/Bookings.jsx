import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import "./bookings.css";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchBookings = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/bookings/user/${user._id}`);
        setBookings(response.data.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  return (
    <Container fluid className="bookings-container my-5">
      <h2 className="text-center mb-4 fw-bold">My Bookings</h2>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" className="text-primary" />
          <p className="mt-2">Fetching bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center text-muted my-5">
          <h4>No bookings found</h4>
          <p>Try booking a service.</p>
        </div>
      ) : (
        <Row className="g-4 justify-content-center">
          {bookings.map((booking) => (
            <Col key={booking._id} xs={12} sm={6} md={4} lg={3}>
              <Card className="shadow-sm booking-card">
                <Card.Img
                  variant="top"
                  src={booking.service.imageGallery[0]}
                  alt={booking.service.title}
                  className="booking-card-img"
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="text-truncate">{booking.service.title}</Card.Title>
                  <Card.Text><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</Card.Text>
                  <Card.Text className="fw-bold text-primary">Price: ${booking.service.price}</Card.Text>
                  <Button variant="primary" className="mt-auto" onClick={() => navigate(`/services/${booking.service._id}`)}>
                    View Service
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default MyBookings;
