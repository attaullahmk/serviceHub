

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Carousel, Button } from "react-bootstrap";
import ServiceFilters from "./ServiceFilters";
import MapboxMap from "../../components/MapboxMap";
import "./services.css";
import BookingForm from "./BookingForm";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import ReactStars from "react-stars";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ServicesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [sortByPrice, setSortByPrice] = useState("");
  const [sortByRating, setSortByRating] = useState("");
  const [availability, setAvailability] = useState("");
  const [priceRange, setPriceRange] = useState("");


  // In your ServicesPage component, update the visibleServices state and loadMore function:
const [visibleServices, setVisibleServices] = useState(isSidebarCollapsed ? 16 : 12);

useEffect(() => {
  setVisibleServices(isSidebarCollapsed ? 16 : 12);
}, [isSidebarCollapsed]);

const loadMore = () => {
  setVisibleServices(prev => prev + (isSidebarCollapsed ? 16 : 12));
};
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      const searchParams = new URLSearchParams(location.search);
      
      try {
        const response = await axios.get(`${BASE_URL}/api/services/search`, {
          params: {
            category: searchParams.get("category") || "",
            title: searchParams.get("title") || "",
            address: searchParams.get("address") || "",
            sortByPrice,
            sortByRating,
            availability,
            priceRange
          },
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

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

 

  return (
    <div className="services-page-wrapper">
      <Container fluid className="services-container">
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

        <Row className="services-layout">
          <Col 
            xs={12} 
            lg={isSidebarCollapsed ? 9 : 6} 
            className="services-list-col"
          >
            <div className="services-list-content">
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
                <>
               <Row className="g-4 services-list">
  {services
    .filter(service => service.status === "approved")
    .slice(0, visibleServices)
    .map((service) => (
      <Col 
        key={service._id} 
        xs={12} 
        sm={6} 
        md={6} 
        lg={isSidebarCollapsed ? 4 : 6}
        xl={isSidebarCollapsed ? 3 : 4}
      >
        <Card
          className="shadow-sm service-card h-100"
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
                    loading="lazy"
                    style={{ height: "auto", objectFit: "contain" }}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          </div>

          <Card.Body className="d-flex flex-column p-3">
            <Card.Title className="service-title text-truncate">
              {service.title}
            </Card.Title>

            <div className="d-flex align-items-center my-2">
              <ReactStars
                count={5}
                value={service.averageRating || 0}
                size={18}
                color1="#e0e0e0"
                color2="#ffc107"
                edit={false}
                half={true}
              />
              <span className="ms-2 small text-muted">
                {service.averageRating?.toFixed(1)} ({service.totalReviews || 0})
              </span>
            </div>

            <Card.Text className="service-description text-muted mb-2">
              {service.description?.slice(0, 60)}...
            </Card.Text>

            <Card.Text className="fw-bold text-primary mt-auto">
              Rs: {Number(service.price).toLocaleString()} / hour
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    ))}
</Row>
                  {services.length > visibleServices && (
                    <div className="text-center mt-4">
                      <Button variant="outline-primary" onClick={loadMore}>
                        Load More
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </Col>

<Col 
  xs={12} 
  lg={isSidebarCollapsed ? 3 : 6} 
  className={`map-booking-sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}
  style={{ display: 'flex', flexDirection: 'column' }}
>
  <div className="sidebar-content">
    <div className="map-section">
      <Button 
        variant="light" 
        className="sidebar-toggle-btn"
        onClick={toggleSidebar}
      >
        {isSidebarCollapsed ? <FaArrowLeft /> : <FaArrowRight />}
      </Button>
      {services.length > 0 ? (
        <MapboxMap services={services} key={JSON.stringify(services)} />
      ) : (
        <p className="text-center text-muted">No services available on the map.</p>
      )}
    </div>
    
    <div className="booking-section">
      <BookingForm service={services} />
    </div>
  </div>
</Col>


        </Row>
      </Container>
    </div>
  );
};

export default ServicesPage;