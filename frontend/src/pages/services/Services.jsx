import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Carousel } from "react-bootstrap";
import ServiceFilters from "./ServiceFilters"; // Import new filter component
import MapboxMap from "../../components/MapboxMap";
import "./services.css";
import BookingForm from "./BookingForm";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ServicesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [sortByPrice, setSortByPrice] = useState("");
  const [sortByRating, setSortByRating] = useState("");
  const [availability, setAvailability] = useState("");
  const [priceRange, setPriceRange] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      const searchParams = new URLSearchParams(location.search);
      const category = searchParams.get("category") || "";
      const title = searchParams.get("title") || "";
      const address = searchParams.get("address") || "";

      try {
        const response = await axios.get(`${BASE_URL}/api/services/search`, {
          params: { category, title, address, sortByPrice, sortByRating, availability, priceRange },
        });
        setServices(response.data.services);
      } catch (error) {
        console.error("Error fetching services:", error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [location.search, sortByPrice, sortByRating, availability, priceRange]);

  return (
    <Container fluid className="services-container">
      {/* Filter Component */}
      <ServiceFilters
        sortByPrice={sortByPrice}
        setSortByPrice={setSortByPrice}
        sortByRating={sortByRating}
        setSortByRating={setSortByRating}
        availability={availability}
        setAvailability={setAvailability}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
      />

      {/* Toggle Button for Mobile */}
      <Row className="d-lg-none mb-3">
        <Col className="text-center">
          <div className="btn-group">
            <button
              className={`btn ${!showMap ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setShowMap(false)}
            >
              List
            </button>
            <button
              className={`btn ${showMap ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setShowMap(true)}
            >
              Map
            </button>
          </div>
        </Col>
      </Row>

      <Row className="g-4 services-layout">
        {/* Services List */}
        <Col 
          xs={12} 
          lg={7} 
          className={`services-list ${showMap ? "d-none d-lg-block" : "d-block"}`}
        >
          <h2 className="text-center mb-4 fw-bold">Available Services</h2>

          {loading ? (
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-2">Fetching services...</p>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center text-muted my-5">
              <h4>No services found</h4>
              <p>Try adjusting your search filters.</p>
            </div>
          ) : (
            <Row className="g-4">
              {services.map((service) => (
                <Col key={service._id} xs={12} sm={6} md={4} lg={6} xl={4}>
                  <Card
                    className="shadow-sm service-card"
                    onClick={() => navigate(`/services/${service._id}`)}
                  >
                    <div className="carousel-container">
                      <Carousel controls={false} indicators={true}>
                        {service.imageGallery?.map((image, index) => (
                          <Carousel.Item key={index}>
                            <img
                              src={image}
                              className="d-block w-100 service-image"
                              alt={`Service ${index}`}
                            />
                          </Carousel.Item>
                        ))}
                      </Carousel>
                    </div>

                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="text-truncate">{service.title}</Card.Title>
                      <Card.Text className="text-truncate">
                        {service.description?.slice(0, 50)}...
                      </Card.Text>
                      <Card.Text className="fw-bold text-primary">
                        {/* Price: PKR{service.price} */}
                        <strong>Price:</strong> PKR {Number(service.price).toLocaleString()} / hour
                        </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Col>

        {/* Map Container */}
        <Col 
          xs={12} 
          lg={5} 
          className={`map-container ${showMap ? "d-block" : "d-none d-lg-block"}`}
        >
          {services.length > 0 ? (
            <MapboxMap services={services} key={JSON.stringify(services)} />
          ) : (
            <p className="text-center text-muted">No services available on the map.</p>
          )}
           <BookingForm service={services} /> {/* Booking Form Component */}
        </Col>


      </Row>
    </Container>
  );
};

export default ServicesPage;
