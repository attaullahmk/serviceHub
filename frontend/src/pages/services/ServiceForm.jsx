import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ServiceForm.css";
import {
  FaCoffee,
  FaBriefcase,
  FaMoon,
  FaMugHot,
  FaMotorcycle,
  FaFire,
  FaStar,
  FaTools,
  FaTree,
  FaBroom,
  FaSprayCan,
  FaTruckPickup,
  FaCar,
  FaSpa,
  FaDumbbell,
  FaHandSparkles
} from "react-icons/fa";
import { MdElectricalServices, MdLocalLaundryService } from "react-icons/md";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ServiceForm = () => {
  const navigate = useNavigate();
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
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    { name: "Breakfast & Brunch", icon: FaCoffee },
    { name: "Lunch", icon: FaBriefcase },
    { name: "Dinner", icon: FaMoon },
    { name: "Coffee & Cafes", icon: FaMugHot },
    { name: "Takeout", icon: FaMotorcycle },
    { name: "Hot & Trendy", icon: FaFire },
    { name: "New Restaurants", icon: FaStar },
    { name: "Electricians", icon: MdElectricalServices },
    { name: "Plumbers", icon: FaTools },
    { name: "Landscaping", icon: FaTree },
    { name: "Cleaning Services", icon: FaBroom },
    { name: "Handyman", icon: FaTools },
    { name: "Pest Control", icon: FaSprayCan },
    { name: "Mechanics", icon: FaTools },
    { name: "Car Wash", icon: MdLocalLaundryService },
    { name: "Towing", icon: FaTruckPickup },
    { name: "Auto Detailing", icon: FaSprayCan },
    { name: "Car Rentals", icon: FaCar },
    { name: "Spas", icon: FaSpa },
    { name: "Fitness", icon: FaDumbbell },
    { name: "Nail Salons", icon: FaHandSparkles },
    { name: "Massage", icon: FaSpa },
    { name: "Personal Trainers", icon: FaDumbbell },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCategorySelect = (category) => {
    setFormData(prev => ({ ...prev, category: category.name }));
    setSelectedCategory(category);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setMessage("You can upload a maximum of 5 images");
      return;
    }
    setImages(files);
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.title.trim()) {
      tempErrors.title = "Title is required.";
    }
    if (formData.description.trim().length < 10) {
      tempErrors.description = "Description must be at least 10 characters long.";
    }
    if (!formData.category) {
      tempErrors.category = "Category is required.";
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
      const response = await axios.post(`${BASE_URL}/api/services`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      setMessage("Service created successfully! Redirecting...");
      
      // Redirect to the newly created service page after 1.5 seconds
      console.log("Service created successfully:", response.data.service);
      setTimeout(() => {
        navigate(`/services/${response.data.service._id}`);
      }, 1500);
    } catch (error) {
      console.error("Error creating service:", error);
      setMessage(error.response?.data?.message || "Failed to submit service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="service-form-container">
      <div className="form-wrapper">
        <div className="form-header text-center mb-5">
          <h2 className="fw-bold">Create a New Service</h2>
          <p className="text-muted">Fill in the details to list your service</p>
        </div>

        {message && (
          <div className={`alert ${message.includes("success") ? "alert-success" : "alert-danger"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="service-form">
          <div className="mb-4">
            <label className="form-label fw-semibold">Service Title*</label>
            <input
              type="text"
              name="title"
              className={`form-control form-control-lg ${errors.title ? "is-invalid" : ""}`}
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Professional Plumbing Services"
            />
            {errors.title && <div className="invalid-feedback">{errors.title}</div>}
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Description*</label>
            <textarea
              name="description"
              className={`form-control ${errors.description ? "is-invalid" : ""}`}
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Describe your service in detail..."
            />
            {errors.description && <div className="invalid-feedback">{errors.description}</div>}
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Category*</label>
            {errors.category && <div className="text-danger small mb-2">{errors.category}</div>}
            
            <div className="category-selection mb-3">
              {selectedCategory ? (
                <div className="selected-category-card">
                  <div className="category-icon">
                    <selectedCategory.icon />
                  </div>
                  <span>{selectedCategory.name}</span>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => {
                      setSelectedCategory(null);
                      setFormData(prev => ({ ...prev, category: "" }));
                    }}
                  />
                </div>
              ) : (
                <div className="category-grid">
                  {categories.map((category, index) => {
                    const Icon = category.icon;
                    return (
                      <div
                        key={index}
                        className={`category-card ${formData.category === category.name ? "selected" : ""}`}
                        onClick={() => handleCategorySelect(category)}
                      >
                        <div className="category-icon">
                          <Icon />
                        </div>
                        <span>{category.name}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Price ($)*</label>
              <input
                type="number"
                name="price"
                className={`form-control ${errors.price ? "is-invalid" : ""}`}
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              {errors.price && <div className="invalid-feedback">{errors.price}</div>}
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Location*</label>
              <input
                type="text"
                name="address"
                className={`form-control ${errors.address ? "is-invalid" : ""}`}
                value={formData.address}
                onChange={handleChange}
                placeholder="Where is your service located?"
              />
              {errors.address && <div className="invalid-feedback">{errors.address}</div>}
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Upload Images (Max 5)</label>
            <div className="file-upload-wrapper">
              <input
                type="file"
                name="images"
                className="form-control"
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
              <div className="file-upload-label">
                <span>Choose files</span>
                <span className="text-muted ms-2">{images.length > 0 ? `${images.length} file(s) selected` : "No files chosen"}</span>
              </div>
            </div>
            {images.length > 0 && (
              <div className="image-preview mt-3">
                {images.map((image, index) => (
                  <div key={index} className="preview-item">
                    <img src={URL.createObjectURL(image)} alt={`Preview ${index}`} />
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => setImages(images.filter((_, i) => i !== index))}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="d-grid mt-4">
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Creating Service...
                </>
              ) : (
                "Create Service"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceForm;

















// import React, { useState } from "react";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./serviceForm.css";
// const BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const ServiceForm = () => {
//   const providerId = useSelector((state) => state.auth.user?._id) || "";

//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     category: "",
//     price: "",
//     address: "",
//     provider: providerId,
//   });

//   const [images, setImages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [errors, setErrors] = useState({});

//   const categories = [
//     // "Delivery",
//     "Contractors",
//     "Electricians",
//     "Plumbers",
//     "Movers",
//     "Auto Repair",
//     // "Parking",
//   ];

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleFileChange = (e) => {
//     setImages(Array.from(e.target.files));
//   };

//   const validateForm = () => {
//     let tempErrors = {};
//     if (formData.description.trim().length < 10) {
//       tempErrors.description = "Description must be at least 10 characters long.";
//     }
//     if (Number(formData.price) <= 0 || isNaN(Number(formData.price))) {
//       tempErrors.price = "Price must be a positive number.";
//     }
//     if (!formData.address.trim()) {
//       tempErrors.address = "Address is required.";
//     }
//     setErrors(tempErrors);
//     return Object.keys(tempErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;
//     setLoading(true);

//     const formDataToSend = new FormData();
//     Object.entries(formData).forEach(([key, value]) => {
//       formDataToSend.append(key, value);
//     });
//     formDataToSend.append("availability", true);
//     images.forEach((image) => {
//       formDataToSend.append("images", image);
//     });

//     try {
//       await axios.post(`${BASE_URL}/api/services`, formDataToSend, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       setMessage("Service created successfully!");
//       setFormData({
//         title: "",
//         description: "",
//         category: "",
//         price: "",
//         address: "",
//         provider: providerId,
//       });
//       setImages([]);
//     } catch (error) {
//       setMessage("Failed to submit service.");
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="container mt-5">
//       <h2 className="text-center mb-4">Create New Service</h2>
//       {message && <div className="alert alert-info">{message}</div>}
//       <form onSubmit={handleSubmit} className="p-4 border rounded shadow bg-white">
//         <div className="mb-3">
//           <label className="form-label">Title</label>
//           <input
//             type="text"
//             name="title"
//             className="form-control"
//             value={formData.title}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="mb-3">
//           <label className="form-label">Description</label>
//           <textarea
//             name="description"
//             className={`form-control ${errors.description ? "is-invalid" : ""}`}
//             value={formData.description}
//             onChange={handleChange}
//             required
//           />
//           {errors.description && <div className="invalid-feedback">{errors.description}</div>}
//         </div>

//         <div className="mb-3">
//           <label className="form-label">Category</label>
//           <select
//             name="category"
//             className="form-select"
//             value={formData.category}
//             onChange={handleChange}
//             required
//           >
//             <option value="">Select a category</option>
//             {categories.map((category, index) => (
//               <option key={index} value={category}>{category}</option>
//             ))}
//           </select>
//         </div>

//         <div className="mb-3">
//           <label className="form-label">Price</label>
//           <input
//             type="number"
//             name="price"
//             className={`form-control ${errors.price ? "is-invalid" : ""}`}
//             value={formData.price}
//             onChange={handleChange}
//             required
//           />
//           {errors.price && <div className="invalid-feedback">{errors.price}</div>}
//         </div>

//         <div className="mb-3">
//           <label className="form-label">Address</label>
//           <input
//             type="text"
//             name="address"
//             className={`form-control ${errors.address ? "is-invalid" : ""}`}
//             value={formData.address}
//             onChange={handleChange}
//             required
//           />
//           {errors.address && <div className="invalid-feedback">{errors.address}</div>}
//         </div>

//         <div className="mb-3">
//           <label className="form-label">Upload Images</label>
//           <input
//             type="file"
//             name="images"
//             className="form-control"
//             multiple
//             accept="image/*"
//             onChange={handleFileChange}
//           />
//         </div>

//         <button type="submit" className="btn btn-primary w-100" disabled={loading}>
//           {loading ? "Submitting..." : "Submit Service"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ServiceForm;
