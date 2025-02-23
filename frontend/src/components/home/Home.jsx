import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Carousel, Card, Container, Row, Col, Spinner } from "react-bootstrap";
import "./Home.css"; // Add CSS for styling
import Slider from "./Slider";

const ServiceCards = () => {
  const [latestServices, setLatestServices] = useState([]);
  const [topRatedServices, setTopRatedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:3000/api/services/latest"),
      axios.get("http://localhost:3000/api/services/top-rated"),
    ])
      .then(([latestResponse, topRatedResponse]) => {
        if (latestResponse.data && Array.isArray(latestResponse.data.services)) {
          setLatestServices(latestResponse.data.services.slice(0, 8));
        } else {
          console.error("Expected an array but got:", latestResponse.data.services);
        }

        if (topRatedResponse.data && Array.isArray(topRatedResponse.data.services)) {
          setTopRatedServices(topRatedResponse.data.services.slice(0, 8));
        } else {
          console.error("Expected an array but got:", topRatedResponse.data.services);
        }
      })
      .catch(error => {
        console.error("Error fetching services:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  }

  const renderServiceCards = (services) => (
    services.length > 0 ? (
      services.map((service) => (
        <Col key={service._id} xs={12} sm={6} md={4} lg={3} xl={3}>
          <Card 
            className="shadow-sm service-card"
            onClick={() => navigate(`/services/${service._id}`)}
            style={{ height: "300px", display: "flex", flexDirection: "column" }} // Fixed height
          >
            {/* Image Section with Fixed Height */}
            <div style={{ height: "150px", overflow: "hidden" }}>
              <Carousel controls={false} indicators={true}>
                {service.imageGallery?.map((image, index) => (
                  <Carousel.Item key={index}>
                    <img
                      src={image}
                      className="d-block w-100"
                      alt={`Service ${index}`}
                      style={{ height: "150px", width: "100%", objectFit: "cover" }} // Fixed size
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            </div>

            {/* Text Section */}
            <Card.Body className="d-flex flex-column justify-content-center" style={{ height: "150px" }}>
              <Card.Title className="text-truncate">{service.title}</Card.Title>
              <Card.Text className="text-truncate">
                {service.description?.slice(0, 50)}...
              </Card.Text>
              <Card.Text className="fw-bold text-primary">Price: ${service.price}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))
    ) : (
      <p className="text-center">No services available.</p>
    )
  );

  return (
    <>
      <Slider />
      <Container className="my-4 px-4">
        {/* Latest Services */}
        <h1 className="text-center">Latest Update</h1>
        <Row className="g-4 justify-content-center">
          {renderServiceCards(latestServices)}
        </Row>

        {/* Top Rated Services */}
        <h1 className="text-center mt-5">Top Rated Services</h1>
        <Row className="g-4 justify-content-center">
          {renderServiceCards(topRatedServices)}
        </Row>
      </Container>
    </>
  );
};

export default ServiceCards;
