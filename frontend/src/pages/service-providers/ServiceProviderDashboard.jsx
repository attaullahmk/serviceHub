import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Container, Row, Col, Card, Button, Spinner, Table, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./ServiceProviderDashboard.css";

const ServiceProviderDashboard = () => {
  const [privileges, setPrivileges] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchProviderDetails = async () => {
      try {
        console.log("Fetching provider details for user:", user);
        const response = await axios.get(`http://localhost:3000/api/serviceProviders/dashboard/${user._id}`);
        setPrivileges(response.data);
      } catch (error) {
        console.error("Error fetching provider details:", error);
      }
    };

    const fetchServices = async () => {
      try {
        console.log("Fetching services for user:", user);
        const response = await axios.get(`http://localhost:3000/api/services/provider/${user._id}`);
        setServices(response.data.services);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchProviderDetails();
    fetchServices();
    setLoading(false);
  }, [user]);

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" className="text-primary" />
        <p className="mt-2">Loading Dashboard...</p>
      </div>
    );
  }

  console.log("Privilages",privileges)
  console.log("serviesc",services)
  if (!privileges) {
    return (
      <Container className="text-center my-5">
        <h4>No Provider Data Available</h4>
      </Container>
    );
  }
  return (
    <Container className="provider-dashboard my-5">
      <h2 className="text-center mb-4 fw-bold">Service Provider Dashboard</h2>

      {/* Provider Info */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row>
            <Col md={6}>
              <h4>{privileges.providerDetails.name}</h4>
              <p><strong>Email:</strong> {privileges.providerDetails.email}</p>
              <p><strong>Phone:</strong> {privileges.providerDetails.phone}</p>
            </Col>
            <Col md={6} className="text-md-end">
              <p><strong>Address:</strong> {privileges.providerDetails.address}</p>
              <p>
                <strong>Availability:</strong>{" "}
                <Badge bg={privileges.providerDetails.availability ? "success" : "danger"}>
                  {privileges.providerDetails.availability ? "Available" : "Not Available"}
                </Badge>
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Services List */}
      <h4 className="mb-3">Your Services</h4>
      {services.length === 0 ? (
        <p className="text-muted">You haven't listed any services yet.</p>
      ) : (
        <Table striped bordered hover className="shadow-sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Service</th>
              <th>Price</th>
              <th>Bookings</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, index) => (
              <tr key={service._id}>
                <td>{index + 1}</td>
                <td>{service.title}</td>
                <td>${service.price}</td>
                <td>{service.bookings?.length || 0}</td>
                <td>
                  <Button variant="primary" size="sm" onClick={() => navigate(`/services/${service._id}`)}>
                    View
                  </Button>{" "}
                  <Button variant="warning" size="sm">
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Manage Services Button */}
      <div className="text-center mt-4">
        <Button variant="success" onClick={() => navigate("/add-service")}>
          Add New Service
        </Button>
      </div>
    </Container>
  );
};

export default ServiceProviderDashboard;
