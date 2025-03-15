import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Carousel, Button, Spinner, Card, Badge } from "react-bootstrap";
import "./ServiceDetail.css";
import MapboxMap from "../../components/MapboxMap";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";
import { useSelector } from "react-redux";
import Message from "../../pages/messages/Messages";
import BookingForm from "../bookings/BookingForm"; // Import Booking Form

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth); // Get user from Redux

  useEffect(() => {
    axios.get(`http://localhost:3000/api/services/${id}`)
      .then(response => {
        setService(response.data);
      })
      .catch(error => {
        console.error("Error fetching service details:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // Handle Delete Service
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await axios.delete(`http://localhost:3000/api/services/${id}`);
        alert("Service deleted successfully!");
        navigate("/"); // Redirect to homepage or service list
      } catch (error) {
        console.error("Error deleting service:", error);
        alert("Failed to delete service.");
      }
    }
  };

  if (loading) {
    return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  }

  if (!service) {
    return <p className="text-center">Service not found.</p>;
  }

  const isOwner = user?._id === service.service.provider._id;
console.log(user);
  return (
    <Container className="service-detail-container my-5">
      <Row className="justify-content-center">
        {/* Left Side - 60% Width (Carousel + Details) */}
        <Col lg={7} md={12} className="mb-4">
          <Card className="p-4 shadow-lg service-card">
            <Carousel className="detail-carousel mb-4">
              {service.service.imageGallery?.length > 0 ? (
                service.service.imageGallery.map((image, index) => (
                  <Carousel.Item key={index}>
                    <img
                      src={image}
                      className="d-block mx-auto detail-image"
                      alt={`Service ${index}`}
                    />
                  </Carousel.Item>
                ))
              ) : (
                <p>No images available</p>
              )}
            </Carousel>

            <h2 className="service-title">{service.service.title}</h2>
            <p className="service-description">{service.service.description}</p>
            <h4 className="service-price">Price: ${service.service.price}</h4>
            <p><strong>Category:</strong> {service.service.category}</p>
            <p><strong>Address:</strong> {service.service.address}</p>
            <p>
              <strong>Availability:</strong>{" "}
              <Badge bg={service.service.availability ? "success" : "danger"}>
                {service.service.availability ? "Available" : "Not Available"}
              </Badge>
            </p>
            <p><strong>Average Rating:</strong> <span className="text-warning"> ★ {service.service.averageRating}</span></p>

            {/* Buttons for Edit and Delete (Visible only for owner) */}
            {isOwner && (
              <div className="d-flex justify-content-between mt-3">
                <Button 
                  variant="warning" 
                  onClick={() => navigate(`/editService/${id}`)}
                >
                  Edit
                </Button>
                <Button 
                  variant="danger" 
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </div>
            )}

            {/* Booking Form (Added Below Service Details) */}
            {!isOwner && <BookingForm serviceId={service.service._id} userId={user?._id} service={service} />}

            {/* Review Section */}
            <ReviewList serviceId={service.service._id} user={user} />
            <ReviewForm serviceId={service.service._id} />
          </Card>
        </Col>

        {/* Right Side - 40% Width (Map) */}
        <Col lg={5} md={12}>
          <div className="map-container">
            <MapboxMap services={[service.service]} />
          </div>
        </Col>

        {/* Add a wrapper div around Message */}
        <Message receiverId={service.service.provider._id}  serviceId={service.service._id}/>
      </Row>
    </Container>
  );
};

export default ServiceDetail;
