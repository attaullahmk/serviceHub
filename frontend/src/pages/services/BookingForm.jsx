import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import "./BookingForm.css";
import { Form, Button, Card, Alert } from "react-bootstrap";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const BookingForm = ({service }) => {
  const Id = useSelector((state) => state.auth.user?._id) || ""; 
  const [formData, setFormData] = useState({
    category: "",
    area: "",
    offeredPrice: "",
    description: "",
  });
 console.log(service , "service in booking form");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await axios.post(
        `${BASE_URL}/api/bookings/bookings`,
        {
          ...formData,
          id: Id, // 🧠 still sending the user id if available
        }
      );

      setSuccessMessage(response.data.message || "Booking request sent!");
      console.log(response, "response data in booking form");
      setFormData({ category: "", area: "", offeredPrice: "", description: "" });
    } catch (error) {
      console.error(error);
      setErrorMessage(error.response?.data?.error || "Something went wrong!");
    }
  };

  return (
    <div className="booking-form-container">
      <Card className="p-4 shadow">
        <h2 className="text-center mb-4">Book a Service</h2>

        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Service Category</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g., Electrician, Plumber"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="area">
            <Form.Label>Area / Location</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g., Gulshan, Malir, etc."
              name="area"
              value={formData.area}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="offeredPrice">
            <Form.Label>Your Offered Price ($)</Form.Label>
            <Form.Control
              type="number"
              placeholder="e.g., 50"
              name="offeredPrice"
              value={formData.offeredPrice}
              onChange={handleChange}
              required
              min="1"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Service Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Optional details about your service needs..."
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Book Now
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default BookingForm;
