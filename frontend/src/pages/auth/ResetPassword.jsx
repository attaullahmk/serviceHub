// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./ResetPassword.css";
// const BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const ResetPassword = () => {
//   const [formData, setFormData] = useState({
//     email: "",
//     otp: "",
//     newPassword: "",
//   });

//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   // Handle Input Change
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Handle Form Submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setError("");

//     try {
//       const response = await axios.post(`${BASE_URL}/api/auth/reset-password`, formData);
//       setMessage(response.data.message);
//       setTimeout(() => navigate("/login"), 2000); // Redirect to login after success
//     } catch (err) {
//       setError(err.response?.data?.message || "Something went wrong!");
//     }
//   };

//   return (
//     <div className="container reset-password-container">
//       <div className="card reset-password-card">
//         <h2 className="text-center">Reset Password</h2>

//         {message && <div className="alert alert-success">{message}</div>}
//         {error && <div className="alert alert-danger">{error}</div>}

//         <form onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <label className="form-label">Email</label>
//             <input
//               type="email"
//               className="form-control"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="mb-3">
//             <label className="form-label">Enter OTP</label>
//             <input
//               type="text"
//               className="form-control"
//               name="otp"
//               value={formData.otp}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="mb-3">
//             <label className="form-label">New Password</label>
//             <input
//               type="password"
//               className="form-control"
//               name="newPassword"
//               value={formData.newPassword}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <button type="submit" className="btn btn-primary w-100">
//             Reset Password
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;


import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import { FiMail, FiKey, FiLock, FiCheckCircle } from "react-icons/fi";
import "./ResetPassword.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/api/auth/reset-password`, formData);
      setMessage(response.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      show={showModal} 
      onHide={() => navigate("/")} 
      centered
      size="lg"
      className="reset-password-modal"
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="w-100 text-center">
          <h3 className="fw-bold">Reset Your Password</h3>
          <p className="text-muted">Enter your details to set a new password</p>
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {message && (
          <Alert variant="success" className="text-center">
            <FiCheckCircle className="me-2" />
            {message}
          </Alert>
        )}
        {error && (
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <div className="input-group">
              <span className="input-group-text bg-light">
                <FiMail className="text-primary" />
              </span>
              <Form.Control
                type="email"
                name="email"
                placeholder="Your email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <div className="input-group">
              <span className="input-group-text bg-light">
                <FiKey className="text-primary" />
              </span>
              <Form.Control
                type="text"
                name="otp"
                placeholder="Enter OTP"
                value={formData.otp}
                onChange={handleChange}
                required
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-4">
            <div className="input-group">
              <span className="input-group-text bg-light">
                <FiLock className="text-primary" />
              </span>
              <Form.Control
                type="password"
                name="newPassword"
                placeholder="New password"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
            </div>
          </Form.Group>

          <Button 
            variant="primary" 
            type="submit" 
            className="w-100 py-2 reset-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </Form>

        <div className="text-center mt-3">
          <Button 
            variant="link" 
            className="text-decoration-none"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ResetPassword;