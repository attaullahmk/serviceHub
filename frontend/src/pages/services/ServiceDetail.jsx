import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Carousel, Button, Spinner, Card, Badge } from "react-bootstrap";
import ReactStars from "react-stars";
import "./ServiceDetail.css";
import MapboxMap from "../../components/MapboxMap";
import ReviewForm from "./reviews/ReviewForm";
import ReviewList from "./reviews/ReviewList";
import { useSelector } from "react-redux";
import Message from "../../pages/messages/MessageBox";
import BookingForm from "../bookings/BookingForm";
import ReviewStars from "./reviews/ReviewStars";

import {FaCalendarAlt, FaMapMarkerAlt, FaPhone, FaBriefcase } from "react-icons/fa";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
// Ensure you have the correct path to your environment variable
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
// ... existing state declarations ...
  const [providerProfile, setProviderProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Separate effect to fetch provider profile
  useEffect(() => {
    const fetchProviderProfile = async () => {
      if (!service?.service?.provider?._id) return;
      
      try {
        const response = await axios.get(
          `${BASE_URL}/api/userProfiles/${service.service.provider._id}`
        );
        console.log(response.data, "provider profile response data");
        setProviderProfile(response.data);
      } catch (error) {
        console.error("Error fetching provider profile:", error);
        setProviderProfile(null);
      } finally {
        setProfileLoading(false);
      }
    };

    // Only fetch if we have service data with a provider
    if (service?.service?.provider?._id) {
      fetchProviderProfile();
    }
  }, [service]); // Run when service data changes


useEffect(() => {
  const fetchData = async () => {
    try {
      const serviceResponse = await axios.get(`${BASE_URL}/api/services/${id}`);
      
      // Check if service data exists
      if (!serviceResponse.data?.service) {
        throw new Error("Service data not found");
      }
      
      setService(serviceResponse.data);
      
      // Only fetch profile if provider exists
      if (serviceResponse.data.service?.provider?._id) {
        try {
          const profileResponse = await axios.get(
            `${BASE_URL}/api/userProfiles/${serviceResponse.data.service.provider._id}`
          );
          setUserProfile(profileResponse.data);
          console.log(profileResponse.data, "profile response data");
        } catch (profileError) {
          console.error("Error fetching user profile:", profileError);
          // Continue even if profile fails
        }
      }
    } catch (error) {
      console.error("Error fetching service details:", error);
      // Set service to null to show not found message
      setService(null);
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, [id]);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const serviceResponse = await axios.get(`${BASE_URL}/api/services/${id}`);
  //       setService(serviceResponse.data);
  //        console.log(serviceResponse.data.service.provider._id, "service response data");
  //       if (serviceResponse.data?.service?.provider?._id) {
  //         const profileResponse = await axios.get(`${BASE_URL}/api/userProfiles/${serviceResponse.data.service.service.provider._id}`);
  //         console.log(profileResponse.data, "profile response data");
  //         setUserProfile(profileResponse.data);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
    
  //   fetchData();
  // }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await axios.delete(`${BASE_URL}/api/services/${id}`);
        alert("Service deleted successfully!");
        navigate("/");
      } catch (error) {
        console.error("Error deleting service:", error);
        alert("Failed to delete service.");
      }
    }
  };

  const scrollToReviews = () => {
    document.getElementById("reviews-section").scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!service) {
    return <div className="not-found">Service not found.</div>;
  }

  const isOwner = user?._id === service.service.provider._id;
  const isOpen = service.service.availability;
  const reviewCount = service.service.reviews?.length || 0;
  const averageRating = service.service.averageRating || 0;

const calculateTimeOnPlatform = (createdAt) => {
  const joinDate = new Date(createdAt);
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate - joinDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 30) {
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  } else {
    const years = Math.floor(diffDays / 365);
    const remainingMonths = Math.floor((diffDays % 365) / 30);
    if (remainingMonths > 0) {
      return `${years} ${years === 1 ? 'year' : 'years'} and ${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'} ago`;
    }
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  }
};

  return (
    <div className="service-detail-page">
      <Container className="main-content-container">
        {/* Carousel - Full Width */}
        <Row>
          <Col>
   <div className="service-carousel-container mb-4">
  <Carousel fade indicators={false} controls={service.service.imageGallery?.length > 1}>
    {service.service.imageGallery?.length > 0 ? (
      service.service.imageGallery.map((image, index) => (
        <Carousel.Item key={index}>
          <div className="carousel-image-container">
            <img
              src={image}
              alt={`Service ${index + 1}`}
              className="carousel-image"
              onError={(e) => {
                e.target.src = 'path/to/placeholder-image.jpg';
                e.target.onerror = null;
              }}
            />
          </div>
        </Carousel.Item>
      ))
    ) : (
      <Carousel.Item>
        <div className="carousel-image-container">
          <img
            src="path/to/default-placeholder.jpg"
            alt="Service placeholder"
            className="carousel-image"
          />
        </div>
      </Carousel.Item>
    )}
  </Carousel>
</div>
          </Col>
        </Row>

        {/* Main Content with Booking Form */}
        <Row className="g-4">
          <Col>
            <Card className="service-details-card">
              <Row className="main-content-row">
                {/* Booking Form Column */}
                <Col lg={5} className="order-lg-2 mb-4 mb-lg-0">
                  <div className="booking-card">
                    <BookingForm
                      serviceId={service.service._id}
                      userId={user?._id}
                      service={service}
                    />
                    {!isOwner && (
                      <Message
                        receiverId={service.service.provider._id}
                        serviceId={service.service._id}
                        className="mt-4"
                      />
                    )}
                  </div>
                </Col>

                {/* Service Details Column */}
                <Col lg={7} className="order-lg-1">
                  <div className="service-header">
                    <h1 className="service-title">{service.service.title}</h1>
                    
                  <div className="service-meta d-flex align-items-center flex-wrap gap-3 my-3">
  {/* Rating and Reviews */}
  <div className="service-rating-container d-flex align-items-center">
    {/* <ReactStars
      count={5}
      value={averageRating}
      size={20}
      color1="#e6e6e6"
      color2="#ffc107"
      edit={false}
    /> */}
  <div className="d-flex align-items-center">
  <ReviewStars rating={averageRating} />
  <span className="ms-1">({reviewCount} reviews)</span>
   <Button 
      variant="link" 
      className="text-decoration-underline ms-2 p-0"
      onClick={scrollToReviews}
    >
      See all
    </Button>
</div>

  </div>

  {/* Availability Badge - Now in the same line */}
  <div className="service-availability">
    <Badge bg={isOpen ? "success" : "danger"} className="py-2">
      {isOpen ? "Open" : "Closed"} {service.service.hours || "8:00AM-6:00PM"}
    </Badge>
  </div>
</div>

                    {/* <div className="service-categories mb-3">
                      {userProfile?.skills?.map((skill, index) => (
                        <Badge key={index} bg="secondary" className="me-2">
                          {skill}
                        </Badge>
                      ))}
                    </div> */}
                    <div className="service-address mb-3">
                      <p>{service.service.address}</p>
                    </div>
                    {/* {userProfile?.profile?.experience && (
  <div className="service-skills mb-3">
    <h5 className="skills-title mb-2">Skills & Expertise</h5>
       {userProfile.profile.experience.years && (
      <div className="experience-years mt-2">
        <span className="text-muted">
          {userProfile.profile.experience.years}+ years experience
        </span>
      </div>
    )}
    <div className="skills-container">
      {userProfile.profile.experience.skills.map((skill, index) => (
        <Badge key={index} bg="info" className="skill-badge me-2 mb-2">
          {skill}
        </Badge>
      ))}
    </div>
 
  </div>
)} */}

                 


                  </div>

                  <div className="service-description">
                    <p>{service.service.description}</p>
                  </div>

                  {isOwner && (
                    <div className="owner-actions">
                      <Button
                        variant="outline-primary"
                        onClick={() => navigate(`/editService/${id}`)}
                        className="me-2 mb-2 mb-sm-0"
                      >
                        Edit Service
                      </Button>
                      <Button variant="outline-danger" onClick={handleDelete}>
                        Delete Service
                      </Button>
                    </div>
                  )}
                </Col>
              </Row>
            </Card>










{/* Provider Profile Card - Modern Style */}
{!profileLoading && providerProfile && (
  <Card className="mt-4 provider-profile-card">
    <Card.Body className="p-4">
      <Row className="g-4 profile-row">
        {/* Left Column - Profile Image and Basic Info */}
        <Col md={4} className="d-flex flex-column">
          <div className="profile-image-container mb-3 mx-auto">
            <img
              src={providerProfile.profilePicture || "https://images.pexels.com/photos/247851/pexels-photo-247851.jpeg"}
              alt="Provider"
              className="profile-image"
            />
          </div>
          
          <div className="provider-basic-info text-center">
            <h3 className="fw-bold mb-2">{service.service.provider.name}</h3>
             {providerProfile.profile.location && (
                <div className="time-on-platform d-flex justify-content-center align-items-center mb-3">
                  <FaMapMarkerAlt className="me-2 text-muted" />
                  <span>{providerProfile.profile.location}</span>
                </div>
              )}
            <div className="time-on-platform d-flex justify-content-center align-items-center mb-3">
              <FaCalendarAlt className="me-2 text-muted" />
              <span className="text-muted">Joined {calculateTimeOnPlatform(providerProfile.profile.createdAt)}</span>
            </div>
            
            {/* Contact Info - Mobile Only */}
            <div className="d-md-none contact-info-mobile mb-3">
              {providerProfile.profile.location && (
                <div className="detail-item d-flex justify-content-center">
                  <FaMapMarkerAlt className="detail-icon me-2" />
                  <span>{providerProfile.profile.location}</span>
                </div>
              )}
              
              {providerProfile.profile.contactNumber && (
                <div className="detail-item d-flex justify-content-center">
                  <FaPhone className="detail-icon me-2" />
                  <span>{providerProfile.profile.contactNumber}</span>
                </div>
              )}
            </div>
          </div>
        </Col>

        {/* Right Column - Profile Details */}
        <Col md={8} className="profile-details-col">
          {/* Bio */}
          {providerProfile.profile.bio && (
            <div className="bio-section mb-4">
              <h5 className="fw-semibold mb-3">About</h5>
              <p className="bio-text">{providerProfile.profile.bio}</p>
            </div>
          )}
          
          {/* Contact Info - Desktop Only */}
          <div className="d-none d-md-block">
            <div className="details-grid mb-4">
              {/* {providerProfile.profile.location && (
                <div className="detail-item">
                  <FaMapMarkerAlt className="detail-icon" />
                  <span>{providerProfile.profile.location}</span>
                </div>
              )} */}
              
              {providerProfile.profile.contactNumber && (
                <div className="detail-item">
                  <FaPhone className="detail-icon" />
                  <span>{providerProfile.profile.contactNumber}</span>
                </div>
              )}
              
              {providerProfile.profile.experience?.years > 0 && (
                <div className="detail-item">
                  <FaBriefcase className="detail-icon" />
                  <span>{providerProfile.profile.experience.years}+ years experience</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Skills Section */}
          {providerProfile.profile.experience?.skills?.length > 0 && (
            <div className="skills-section mb-4">
              <h5 className="fw-semibold mb-3">Skills & Expertise</h5>
              <div className="skills-container">
                {providerProfile.profile.experience.skills.map((skill, index) => (
                  <Badge key={index} pill className="skill-pill me-2 mb-2">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Social Links */}
          {(providerProfile.profile.socialLinks?.facebook || 
            providerProfile.profile.socialLinks?.twitter || 
            providerProfile.profile.socialLinks?.instagram || 
            providerProfile.profile.socialLinks?.linkedin) && (
            <div className="social-links-section">
              <h5 className="fw-semibold mb-3">Connect</h5>
              <div className="social-icons">
                {providerProfile.profile.socialLinks.facebook && (
                  <a href={providerProfile.profile.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                    <FaFacebook className="social-icon" />
                  </a>
                )}
                {providerProfile.profile.socialLinks.twitter && (
                  <a href={providerProfile.profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                    <FaTwitter className="social-icon" />
                  </a>
                )}
                {providerProfile.profile.socialLinks.instagram && (
                  <a href={providerProfile.profile.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                    <FaInstagram className="social-icon" />
                  </a>
                )}
                {providerProfile.profile.socialLinks.linkedin && (
                  <a href={providerProfile.profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                    <FaLinkedin className="social-icon" />
                  </a>
                )}
              </div>
            </div>
          )}
        </Col>
      </Row>
      
    </Card.Body>
  </Card>
)}

            {/* Reviews Section */}
            <Card id="reviews-section" className="mt-4 p-4">
              <div className="reviews-section">
                {/* <h3>Customer Reviews</h3> */}
                <ReviewList serviceId={service.service._id} user={user} />
                <ReviewForm serviceId={service.service._id} />
              </div>
            </Card>

            {/* Map Section */}
            <Card className="mt-4 p-4 map-card">
              <h2 className="map-title mb-4">Service Location</h2>
              <MapboxMap services={[service.service]} />
            </Card>
          </Col>
        </Row>
          <Message receiverId={service.service.provider._id}  serviceId={service.service._id}/>
      </Container>
    </div>
  );
};

export default ServiceDetail;














// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Container, Row, Col, Carousel, Button, Spinner, Card, Badge } from "react-bootstrap";
// import "./ServiceDetail.css";
// import MapboxMap from "../../components/MapboxMap";
// import ReviewForm from "./reviews/ReviewForm";
// import ReviewList from "./reviews/ReviewList";
// import { useSelector } from "react-redux";
// // import Message from "../../pages/messages/Messages";
// import Message from "../../pages/messages/MessageBox";
// import BookingForm from "../bookings/BookingForm"; // Import Booking Form
// const BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const ServiceDetail = () => {
//   const { id } = useParams();
//   const [service, setService] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const { user } = useSelector((state) => state.auth); // Get user from Redux

//   useEffect(() => {
//     axios.get(`${BASE_URL}/api/services/${id}`)
//       .then(response => {
//         setService(response.data);
//       })
//       .catch(error => {
//         console.error("Error fetching service details:", error);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, [id]);

//   // Handle Delete Service
//   const handleDelete = async () => {
//     if (window.confirm("Are you sure you want to delete this service?")) {
//       try {
//         await axios.delete(`${BASE_URL}/api/services/${id}`);
//         alert("Service deleted successfully!");
//         navigate("/"); // Redirect to homepage or service list
//       } catch (error) {
//         console.error("Error deleting service:", error);
//         alert("Failed to delete service.");
//       }
//     }
//   };

//   if (loading) {
//     return <Spinner animation="border" className="d-block mx-auto mt-5" />;
//   }

//   if (!service) {
//     return <p className="text-center">Service not found.</p>;
//   }

//   const isOwner = user?._id === service.service.provider._id;
// console.log(user);
//   return (
//     <Container className="service-detail-container my-5">
//       <Row className="justify-content-center">
//         {/* Left Side - 60% Width (Carousel + Details) */}
//         <Col lg={7} md={12} className="mb-4">
//           <Card className="p-4 shadow-lg service-card">
//             <Carousel className="detail-carousel mb-4">
//               {service.service.imageGallery?.length > 0 ? (
//                 service.service.imageGallery.map((image, index) => (
//                   <Carousel.Item key={index}>
//                     <img
//                       src={image}
//                       className="d-block mx-auto detail-image"
//                       alt={`Service ${index}`}
//                     />
//                   </Carousel.Item>
//                 ))
//               ) : (
//                 <p>No images available</p>
//               )}
//             </Carousel>

//             <h2 className="service-title">{service.service.title}</h2>
//             <p className="service-description">{service.service.description}</p>
//             <p className="service-price"><strong> Price:</strong> PKR {Number(service.service.price).toLocaleString()}
//             </p>

//             <p><strong>Category:</strong> {service.service.category}</p>
//             <p><strong>Address:</strong> {service.service.address}</p>
//             <p>
//               <strong>Availability:</strong>{" "}
//               <Badge bg={service.service.availability ? "success" : "danger"}>
//                 {service.service.availability ? "Available" : "Not Available"}
//               </Badge>
//             </p>
//             <p><strong>Average Rating:</strong> <span className="text-warning"> ★ {service.service.averageRating}</span></p>

//             {/* Buttons for Edit and Delete (Visible only for owner) */}
//             {isOwner && (
//               <div className="d-flex justify-content-between mt-3">
//                 <Button
//                   variant="warning"
//                   onClick={() => navigate(`/editService/${id}`)}
//                 >
//                   Edit
//                 </Button>
//                 <Button
//                   variant="danger"
//                   onClick={handleDelete}
//                 >
//                   Delete
//                 </Button>
//               </div>
//             )}

//             {/* Review Section */}
//             <ReviewList serviceId={service.service._id} user={user} />
//             <ReviewForm serviceId={service.service._id} />
//           </Card>
//         </Col>

//         {/* Right Side - 40% Width (Map) */}
//         <Col lg={5} md={12}>
//           <div className="map-container">
//             <MapboxMap services={[service.service]} />

//             {/* Booking Form (Added Below Service Details) */}
//             {!isOwner && <BookingForm serviceId={service.service._id} userId={user?._id} service={service} />}
//           </div>

//         </Col>

//         {/* Add a wrapper div around Message */}
//         <Message receiverId={service.service.provider._id}  serviceId={service.service._id}/>
//       </Row>
//     </Container>
//   );
// };

// export default ServiceDetail;
