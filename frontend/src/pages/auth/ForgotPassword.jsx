// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./ForgotPassword.css";
// const BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const ForgotPassword = () => {
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setError("");

//     try {
//       const response = await axios.post(`${BASE_URL}/api/auth/forgot-password`, { email });
//       setMessage(response.data.message);
//       navigate("/reset-password"); // Redirect to Reset Password Page
//     } catch (err) {
//       setError(err.response?.data?.message || "Something went wrong!");
//     }
//   };

//   return (
//     <div className="container forgot-password-container">
//       <div className="card forgot-password-card">
//         <h2 className="text-center">Forgot Password</h2>

//         {message && <div className="alert alert-success">{message}</div>}
//         {error && <div className="alert alert-danger">{error}</div>}

//         <form onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <label className="form-label">Enter your email</label>
//             <input
//               type="email"
//               className="form-control"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           <button type="submit" className="btn btn-primary w-100">
//             Send OTP
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import { FiMail, FiArrowRight } from "react-icons/fi";
import "./ForgotPassword.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/api/auth/forgot-password`, { email });
      setMessage(response.data.message);
      setTimeout(() => navigate("/reset-password"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong!");
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
      className="forgot-password-modal"
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="w-100 text-center">
          <h3 className="fw-bold">Reset Your Password</h3>
          <p className="text-muted">Enter your email to receive a reset link</p>
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {message && (
          <Alert variant="success" className="text-center">
            {message}
          </Alert>
        )}
        {error && (
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <div className="input-group">
              <span className="input-group-text bg-light">
                <FiMail className="text-primary" />
              </span>
              <Form.Control
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                Sending...
              </>
            ) : (
              <>
                Send Reset Link <FiArrowRight className="ms-2" />
              </>
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

export default ForgotPassword;