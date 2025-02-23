import React, { useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../redux/authSlice"; // Import Redux action
import "bootstrap/dist/css/bootstrap.min.css";
import "./serviceProviderForm.css"; // Custom CSS for the form

const ServiceProviderForm = () => {
  // Get the current logged-in user from Redux store
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // For provider-specific fields only.
  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    services: "", // Comma-separated values
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Update state when form fields change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user._id) {
      setMessage("User not found. Please log in.");
      return;
    }

    setLoading(true);

    try {
      // Convert the services string into an array (splitting on commas)
      const servicesArray = formData.services
        .split(",")
        .map((service) => service.trim())
        .filter((service) => service.length > 0);

      // Prepare data to send, including the reference to the logged-in user
      const dataToSend = {
        user: user._id, // Ensure correct user ID is sent
        phone: formData.phone,
        address: formData.address,
        services: servicesArray,
        availability: true, // Always send as true by default
      };

      // Send a POST request to create the service provider
      const response = await axios.post(
        "http://localhost:3000/api/serviceProviders",
        dataToSend
      );

      // Update the user's role in the database
      await axios.put(`http://localhost:3000/api/users/${user._id}`, {
        role: "provider",
      });

      // Update Redux store with new user role
      const updatedUser = { ...user, role: "provider" };
      dispatch(setUser(updatedUser)); // Update Redux state

      setMessage(response.data.message || "Service Provider created successfully. Your role has been updated to provider.");
      
      // Reset form data after successful submission
      setFormData({
        phone: "",
        address: "",
        services: "",
      });
    } catch (error) {
      console.error("Error creating service provider:", error.response?.data || error);
      setMessage(error.response?.data?.message || "Error creating service provider. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="container mt-5 service-provider-form">
      <h2 className="text-center mb-4">Create Service Provider</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit} className="p-4 border rounded shadow bg-white">
        {/* Phone */}
        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input 
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="form-control" 
            pattern="\d{10,15}"  // Ensures only digits (10-15)
            title="Enter a valid phone number (10-15 digits)"
            required 
          />
        </div>
        {/* Address */}
        <div className="mb-3">
          <label className="form-label">Address</label>
          <input 
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="form-control" 
            required 
          />
        </div>
        {/* Services */}
        <div className="mb-3">
          <label className="form-label">Services (comma separated)</label>
          <input 
            type="text"
            name="services"
            value={formData.services}
            onChange={handleChange}
            className="form-control" 
            placeholder="e.g., electrician, plumber"
            required 
          />
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Submitting..." : "Create Provider"}
        </button>
      </form>
    </div>
  );
};

export default ServiceProviderForm;
