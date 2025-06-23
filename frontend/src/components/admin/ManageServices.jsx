// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Button, Spinner } from "react-bootstrap";
// import "./ManageServices.css";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const ManageServices = () => {
//   const [services, setServices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [actionStatus, setActionStatus] = useState("");

//   // Fetch pending services
//   const fetchServices = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("adminToken");
//       const res = await axios.get(`${BASE_URL}/admin/services`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setServices(res.data.services);
//     } catch (err) {
//       console.error("❌ Error fetching services:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchServices();
//   }, []);

//   const handleAction = async (id, action) => {
//     try {
//       const token = localStorage.getItem("adminToken");
//       const res = await axios.patch(
//         `${BASE_URL}/admin/services/${id}/${action}`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setActionStatus(`Service ${action}d successfully.`);
//       // Refetch updated list
//       fetchServices();
//     } catch (err) {
//       console.error("❌ Action error:", err);
//       setActionStatus("Failed to perform action.");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="text-center py-5">
//         <Spinner animation="border" />
//         <p>Loading services...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="container py-5 manage-services">
//       <h2 className="mb-4 text-center">Manage Pending Services</h2>
//       {actionStatus && <div className="alert alert-info">{actionStatus}</div>}

//       {services.length === 0 ? (
//         <p className="text-muted text-center">No pending services found.</p>
//       ) : (
//         <div className="row g-4">
//           {services.map((service) => (
//             <div key={service._id} className="col-md-6 col-lg-4">
//               <div className="card shadow-sm service-card h-100">
//                 {service.imageGallery && service.imageGallery.length > 0 && (
//                   <img
//                     src={service.imageGallery[0]}
//                     className="card-img-top"
//                     alt="service"
//                     style={{ height: "180px", objectFit: "cover" }}
//                   />
//                 )}
//                 <div className="card-body">
//                   <h5 className="card-title">{service.title}</h5>
//                   <p className="card-text text-truncate">{service.description}</p>
//                   <p><strong>Price:</strong> Rs {service.price}</p>
//                   <p><strong>Provider:</strong> {service.provider?.companyName || "N/A"}</p>

//                   <div className="d-flex justify-content-between mt-3">
//                     <Button
//                       variant="success"
//                       size="sm"
//                       onClick={() => handleAction(service._id, "approve")}
//                     >
//                       Approve
//                     </Button>
//                     <Button
//                       variant="danger"
//                       size="sm"
//                       onClick={() => handleAction(service._id, "reject")}
//                     >
//                       Reject
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ManageServices;



import { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Spinner,
  Form,
  Modal,
  Alert
} from "react-bootstrap";
import "./ManageServices.css";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ManageServices = () => {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionStatus, setActionStatus] = useState("");
  const [filterStatus, setFilterStatus] = useState("pending");

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // 🔄 Fetch services
  const fetchServices = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(`${BASE_URL}/admin/services`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setServices(res.data.services);
    } catch (err) {
      console.error("❌ Error fetching services:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // ✅ Approve
  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.patch(`${BASE_URL}/admin/services/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActionStatus("Service approved successfully.");
      fetchServices();
    } catch (err) {
      console.error("❌ Approval error:", err);
      setActionStatus("Failed to approve service.");
    }
  };

  // ❌ Reject
  const handleReject = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.patch(`${BASE_URL}/admin/services/${selectedServiceId}/reject`, {
        rejectionReason,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActionStatus("Service rejected.");
      fetchServices();
      setShowRejectModal(false);
      setRejectionReason("");
    } catch (err) {
      console.error("❌ Rejection error:", err);
      setActionStatus("Failed to reject service.");
    }
  };

  // 🧮 Filtered list
  const filteredServices = services.filter((service) =>
    filterStatus === "all" ? true : service.status === filterStatus
  );

  return (
    <div className="container py-5 manage-services">
      <h2 className="mb-4 text-center">Manage Services</h2>

      {actionStatus && <Alert variant="info">{actionStatus}</Alert>}

      {/* 🔍 Filter */}
      <Form.Select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="mb-4 w-auto mx-auto"
      >
        <option value="all">All</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </Form.Select>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
          <p>Loading services...</p>
        </div>
      ) : filteredServices.length === 0 ? (
        <p className="text-muted text-center">No services found for "{filterStatus}".</p>
      ) : (
        <div className="row g-4">
          {filteredServices.map((service) => (
            <div key={service._id} className="col-md-6 col-lg-4">
              {/* <div className="card shadow-sm h-100"
                onClick={() => navigate(`/admin/services/${service._id}`)}
    style={{ cursor: "pointer" }}
              > */}
              <div
  className="card shadow-sm h-100 clickable-card"
  onClick={() => navigate(`/admin/services/${service._id}`)}
  style={{ cursor: "pointer" }}
>
                {service.imageGallery?.[0] && (
                  <img
                    src={service.imageGallery[0]}
                    className="card-img-top"
                    alt="service"
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{service.title}</h5>
                  <p className="card-text text-truncate">{service.description}</p>
                  <p><strong>Price:</strong> Rs {service.price}</p>
                  <p><strong>Status:</strong> <span className={`text-${service.status === "approved" ? "success" : service.status === "rejected" ? "danger" : "warning"}`}>{service.status}</span></p>
                  {service.rejectionReason && (
                    <p className="text-danger small"><strong>Reason:</strong> {service.rejectionReason}</p>
                  )}
                  <div className="mt-auto d-flex justify-content-between">
                    {service.status === "pending" && (
                      <>
                        {/* <Button variant="success" size="sm" onClick={() => handleApprove(service._id)}>Approve</Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => {
                            setSelectedServiceId(service._id);
                            setShowRejectModal(true);
                          }}
                        >
                          Reject
                        </Button> */}
                        <Button
  variant="success"
  size="sm"
  onClick={(e) => {
    e.stopPropagation();
    handleApprove(service._id);
  }}
>
  Approve
</Button>

<Button
  variant="danger"
  size="sm"
  onClick={(e) => {
    e.stopPropagation();
    setSelectedServiceId(service._id);
    setShowRejectModal(true);
  }}
>
  Reject
</Button>

                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ❌ Reject Modal */}
      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reject Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Reason for rejection</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter reason (optional but helpful)"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleReject}>
            Reject Service
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageServices;
