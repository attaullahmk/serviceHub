import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./serviceForm.css";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ServiceForm = () => {
  const providerId = useSelector((state) => state.auth.user?._id) || "";

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    address: "",
    provider: providerId,
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const categories = [
    // "Delivery",
    "Contractors",
    "Electricians",
    "Plumbers",
    "Movers",
    "Auto Repair",
    // "Parking",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const validateForm = () => {
    let tempErrors = {};
    if (formData.description.trim().length < 10) {
      tempErrors.description = "Description must be at least 10 characters long.";
    }
    if (Number(formData.price) <= 0 || isNaN(Number(formData.price))) {
      tempErrors.price = "Price must be a positive number.";
    }
    if (!formData.address.trim()) {
      tempErrors.address = "Address is required.";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });
    formDataToSend.append("availability", true);
    images.forEach((image) => {
      formDataToSend.append("images", image);
    });

    try {
      await axios.post(`${BASE_URL}/api/services`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Service created successfully!");
      setFormData({
        title: "",
        description: "",
        category: "",
        price: "",
        address: "",
        provider: providerId,
      });
      setImages([]);
    } catch (error) {
      setMessage("Failed to submit service.");
    }
    setLoading(false);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Create New Service</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit} className="p-4 border rounded shadow bg-white">
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className={`form-control ${errors.description ? "is-invalid" : ""}`}
            value={formData.description}
            onChange={handleChange}
            required
          />
          {errors.description && <div className="invalid-feedback">{errors.description}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Category</label>
          <select
            name="category"
            className="form-select"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            type="number"
            name="price"
            className={`form-control ${errors.price ? "is-invalid" : ""}`}
            value={formData.price}
            onChange={handleChange}
            required
          />
          {errors.price && <div className="invalid-feedback">{errors.price}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Address</label>
          <input
            type="text"
            name="address"
            className={`form-control ${errors.address ? "is-invalid" : ""}`}
            value={formData.address}
            onChange={handleChange}
            required
          />
          {errors.address && <div className="invalid-feedback">{errors.address}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Upload Images</label>
          <input
            type="file"
            name="images"
            className="form-control"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Submitting..." : "Submit Service"}
        </button>
      </form>
    </div>
  );
};

export default ServiceForm;
