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
  Table,
  Badge,
  Modal,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./ServiceProviderDashboard.css";
import ProviderBookings from "./ProviderBookings";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { forwardRef } from "react";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CustomToggle = forwardRef(({ onClick }, ref) => (
  <span
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    style={{
      cursor: "pointer",
      fontSize: "1.5rem",
      padding: "0 5px",
      color: "#6c757d",
    }}
  >
    &#8942;
  </span>
));

const ServiceProviderDashboard = () => {
  const [privileges, setPrivileges] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchProviderDetails = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/serviceProviders/dashboard/${user._id}`
        );
        setPrivileges(response.data);
      } catch (error) {
        console.error("Error fetching provider details:", error);
      }
    };

    const fetchServices = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/services/provider/${user._id}`
        );
        setServices(response.data.services);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchProviderDetails();
    fetchServices();
    setLoading(false);
  }, [user]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/services/${id}`);
      alert("Service deleted successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("Failed to delete service.");
    }
  };

  const handleEdit = (id) => {
    navigate(`/editService/${id}`);
  };

  const openDeleteModal = (id) => {
    setSelectedServiceId(id);
    setShowDeleteModal(true);
  };

  const openEditModal = (id) => {
    setSelectedServiceId(id);
    setShowEditModal(true);
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" className="text-primary" />
        <p className="mt-2">Loading Dashboard...</p>
      </div>
    );
  }

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

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row>
            <Col md={6}>
              <h4>{privileges.providerDetails.name}</h4>
              <p>
                <strong>Email:</strong> {privileges.providerDetails.email}
              </p>
              <p>
                <strong>Phone:</strong> {privileges.providerDetails.phone}
              </p>
            </Col>
            <Col md={6} className="text-md-end">
              <p>
                <strong>Address:</strong> {privileges.providerDetails.address}
              </p>
              <p>
                <strong>Availability:</strong>{" "}
                <Badge
                  bg={
                    privileges.providerDetails.availability
                      ? "success"
                      : "danger"
                  }
                >
                  {privileges.providerDetails.availability
                    ? "Available"
                    : "Not Available"}
                </Badge>
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

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
                  <Dropdown align="end">
                    <Dropdown.Toggle
                      as={CustomToggle}
                      id={`dropdown-toggle-${service._id}`}
                    />

                    <Dropdown.Menu>
                      <Dropdown.Item as={Link} to={`/services/${service._id}`}>
                        View
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => openEditModal(service._id)}>
                        Edit
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => openDeleteModal(service._id)}
                        className="text-danger"
                      >
                        Delete
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <ProviderBookings />

      <div className="text-center mt-4">
        <Link to="/createService" className="btn btn-success">
          Add New Service
        </Link>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this service?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              handleDelete(selectedServiceId);
              setShowDeleteModal(false);
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Confirmation Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Edit</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you want to edit this service?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button
            variant="warning"
            onClick={() => {
              handleEdit(selectedServiceId);
              setShowEditModal(false);
            }}
          >
            Edit
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ServiceProviderDashboard;
