import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Badge,
  Modal,
  ProgressBar,
  Tab,
  Tabs,
} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { 
  FiEdit2, 
  FiTrash2, 
  FiEye, 
  FiPlus, 
  FiCalendar,
  FiDollarSign,
  FiStar,
  FiTrendingUp,
  FiUser,
  FiCheckCircle,
  FiCreditCard
} from "react-icons/fi";
import { 
  FaChartLine, 
  FaMoneyBillWave, 
  FaStar, 
  FaRegClock 
} from "react-icons/fa";
import "./ServiceProviderDashboard.css";
import ProviderBookings from "./ProviderBookings";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ServiceProviderDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [activeTab, setActiveTab] = useState("analytics");
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        const [providerRes, servicesRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/serviceProviders/dashboard/${user._id}`),
          axios.get(`${BASE_URL}/api/services/provider/${user._id}`)
        ]);
        
        setDashboardData(providerRes.data);
        setServices(servicesRes.data.services);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/services/${selectedServiceId}`);
      setServices(services.filter(service => service._id !== selectedServiceId));
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/editService/${id}`);
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return "success";
    if (rating >= 3) return "warning";
    return "danger";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(amount).replace('PKR', 'PKR ');
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Spinner animation="border" variant="primary" />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <Container className="no-data">
        <h4>No provider data available</h4>
        <Button variant="primary" onClick={() => window.location.reload()}>
          Refresh
        </Button>
      </Container>
    );
  }

  return (
    <div className="service-provider-dashboard">
      <Container fluid>
        {/* Header Section */}
        <div className="dashboard-header">
          <h2>Service Dashboard</h2>
          <Button variant="primary" as={Link} to="/createService" className="add-service-btn">
            <FiPlus className="me-2" /> New Service
          </Button>
        </div>

        {/* Main Content with Tabs */}
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="dashboard-tabs"
        >
          <Tab eventKey="analytics" title={
            <span>
              <FaChartLine className="me-1" /> Analytics
            </span>
          }>
            {/* Top Analytics Cards */}
            <Row className="g-4 mb-4">
              <Col md={4}>
                <Card className="stat-card">
                  <Card.Body>
                    <div className="stat-icon bg-primary">
                      <FiTrendingUp />
                    </div>
                    <h3>{services.length}</h3>
                    <p className="stat-label">Active Services</p>
                    <ProgressBar now={Math.min(services.length * 10, 100)} variant="primary" />
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="stat-card">
                  <Card.Body>
                    <div className="stat-icon bg-success">
                      <FiDollarSign />
                    </div>
                    <h3>{formatCurrency(dashboardData.analytics.totalValue || 0)}</h3>
                    <p className="stat-label">Total Value</p>
                    <ProgressBar now={70} variant="success" />
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="stat-card">
                  <Card.Body>
                    <div className="stat-icon bg-warning">
                      <FiStar />
                    </div>
                    <h3>{dashboardData.analytics.averageRating?.toFixed(1) || "0.0"}</h3>
                    <p className="stat-label">Avg Rating</p>
                    <ProgressBar 
                      now={(dashboardData.analytics.averageRating || 0) * 20} 
                      variant={getRatingColor(dashboardData.analytics.averageRating)} 
                    />
                  </Card.Body>
                </Card>
              </Col>
              {/* <Col md={3}>
                <Card className="stat-card">
                  <Card.Body>
                    <div className="stat-icon bg-info">
                      <FiUser />
                    </div>
                    <h3>{dashboardData.analytics.totalBookings || 0}</h3>
                    <p className="stat-label">Total Bookings</p>
                    <ProgressBar now={Math.min(dashboardData.analytics.totalBookings * 5, 100)} variant="info" />
                  </Card.Body>
                </Card>
              </Col> */}
            </Row>

            {/* Financial Metrics Cards */}
            <Row className="g-4 mb-4">
              <Col md={4}>
                <Card className="stat-card earnings-card">
                  <Card.Body>
                    <div className="stat-icon bg-success">
                      <FiCheckCircle />
                    </div>
                    <h3>{formatCurrency(dashboardData.analytics.totalEarningsFromCompleted || 0)}</h3>
                    <p className="stat-label">Earnings from Completed</p>
                    <div className="earnings-details">
                      <span className="text-muted">
                        {dashboardData.analytics.completedBookings || 0} completed bookings
                      </span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              {/* <Col md={4}>
                <Card className="stat-card">
                  <Card.Body>
                    <div className="stat-icon bg-primary">
                      <FaMoneyBillWave />
                    </div>
                    <h3>{formatCurrency(dashboardData.analytics.potentialEarnings || 0)}</h3>
                    <p className="stat-label">Potential Earnings</p>
                    <ProgressBar 
                      now={dashboardData.analytics.earningsPercentage || 0} 
                      variant="primary" 
                      label={`${Math.round(dashboardData.analytics.earningsPercentage || 0)}%`}
                    />
                  </Card.Body>
                </Card>
              </Col> */}
              {/* <Col md={4}>
                <Card className="stat-card">
                  <Card.Body>
                    <div className="stat-icon bg-purple">
                      <FiCreditCard />
                    </div>
                    <h3>{formatCurrency(dashboardData.analytics.totalRevenue || 0)}</h3>
                    <p className="stat-label">Total Revenue</p>
                    <ProgressBar 
                      now={100} 
                      variant="purple" 
                    />
                  </Card.Body>
                </Card>
              </Col> */}
               <Col md={4}>
                <Card className="stat-card">
                  <Card.Body>
                    <div className="stat-icon bg-info">
                      <FiUser />
                    </div>
                    <h3>{dashboardData.analytics.totalBookings || 0}</h3>
                    <p className="stat-label">Total Bookings</p>
                    <ProgressBar now={Math.min(dashboardData.analytics.totalBookings * 5, 100)} variant="info" />
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Services Grid */}
            <Row className="g-4">
              {services.map((service) => (
                <Col key={service._id} md={6} lg={4}>
                  <Card className="service-card">
                    {service.imageGallery?.length > 0 && (
                      <div className="service-image-container">
                        <img 
                          src={service.imageGallery[0]} 
                          alt={service.title}
                          className="service-image"
                        />
                      </div>
                    )}
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h5>{service.title}</h5>
                          <Badge bg="light" text="dark" className="category-badge">
                            {service.category}
                          </Badge>
                        </div>
                        <h4 className="text-primary">{formatCurrency(service.price)}</h4>
                      </div>
                      
                      <div className="service-stats">
                        <div className="stat-item">
                          <FiStar 
                            className="icon" 
                            style={{ 
                              color: '#FFC107',
                              marginRight: '5px',
                              verticalAlign: 'middle'
                            }} 
                          />
                          <span>
                            {service.averageRating?.toFixed(1) || "0.0"} 
                            <small className="text-muted">({service.totalReviews || 0})</small>
                          </span>
                        </div>

                        <div className="stat-item">
                          <FiCalendar 
                            className="icon" 
                            style={{ 
                              color: '#0D6EFD',
                              marginRight: '5px',
                              verticalAlign: 'middle'
                            }} 
                          />
                          <span>{service.bookingCount || 0} bookings</span>
                        </div>

                        <div className="stat-item">
                          <FiTrendingUp 
                            className="icon" 
                            style={{ 
                              color: '#198754',
                              marginRight: '5px', 
                              verticalAlign: 'middle'
                            }} 
                          />
                          <span>{service.views || 0} views</span>
                        </div>
                      </div>
                      <div className="service-actions">
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => navigate(`/services/${service._id}`)}
                        >
                          <FiEye /> View
                        </Button>
                        <Button 
                          variant="outline-secondary" 
                          size="sm"
                          onClick={() => handleEdit(service._id)}
                        >
                          <FiEdit2 /> Edit
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => {
                            setSelectedServiceId(service._id);
                            setShowDeleteModal(true);
                          }}
                        >
                          <FiTrash2 /> Delete
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Tab>

          <Tab eventKey="bookings" title={
            <span>
              <FiCalendar className="me-1" /> Bookings
            </span>
          }>
            <ProviderBookings />
          </Tab>
        </Tabs>
      </Container>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this service? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Service
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ServiceProviderDashboard;