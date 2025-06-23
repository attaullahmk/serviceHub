import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Spinner, Badge } from "react-bootstrap";
import "./AdminServiceDetail.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminServiceDetail = () => {
  const { id } = useParams(); // service ID from URL
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchService = async () => {
    try {
      const token = localStorage.getItem("adminToken");
    //   const res = await axios.get(`${BASE_URL}/admin/services/${id}`, {
    //     headers: { Authorization: `Bearer ${token}` },
    //   });
    const res = await axios.get(`${BASE_URL}/admin/services/${id}`, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});

      setService(res.data.service);
    } catch (err) {
      console.error("Failed to fetch service:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchService();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
        <p>Loading service details...</p>
      </div>
    );
  }

  if (!service) {
    return <p className="text-danger text-center">Service not found.</p>;
  }

  const {
    title,
    description,
    price,
    category,
    provider,
    imageGallery,
    status,
    rejectionReason,
    bookingCount,
    views,
    averageRating,
    createdAt,
  } = service;

  return (
    <div className="container py-5 admin-service-detail">
      <Button variant="secondary" onClick={() => navigate(-1)} className="mb-3">
        ← Back to list
      </Button>

      <h2 className="mb-3">{title}</h2>
      <Badge bg={
        status === "approved" ? "success" :
        status === "rejected" ? "danger" : "warning"
      }>
        {status.toUpperCase()}
      </Badge>

      {rejectionReason && (
        <p className="text-danger mt-2"><strong>Rejection Reason:</strong> {rejectionReason}</p>
      )}

      <div className="row mt-4">
        <div className="col-md-6">
          {imageGallery?.[0] && (
            <img
              src={imageGallery[0]}
              alt="Service"
              className="img-fluid rounded shadow-sm"
            />
          )}
        </div>
        <div className="col-md-6">
          <p><strong>Description:</strong> {description}</p>
          <p><strong>Price:</strong> Rs {price}</p>
          <p><strong>Category:</strong> {category}</p>
          <p><strong>Provider:</strong> {provider?.companyName || provider?.name || "N/A"}</p>
          <p><strong>Email:</strong> {provider?.email}</p>
          <p><strong>Booking Count:</strong> {bookingCount}</p>
          <p><strong>Views:</strong> {views}</p>
          <p><strong>Average Rating:</strong> {averageRating}</p>
          <p><strong>Created:</strong> {new Date(createdAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminServiceDetail;
