// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// // import { useNavigate } from "react-router-dom";
// import { useNavigate, useLocation } from "react-router-dom";
// import { loginUser } from "../../redux/AuthSlice"; // Import Redux action
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./Login.css"; // Custom CSS file

// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//     const location = useLocation();
//   const { loading, error, user } = useSelector((state) => state.auth); // Get state from Redux

//   console.log("Auth State in Login Component:", { loading, error, user }); // Debugging

//   // Handle Input Change
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Handle Form Submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("Form Data Submitted:", formData); // Debugging

//     // dispatch(loginUser(formData, navigate))
//     //   .unwrap() // Unwrap the promise to handle success/error
//     //   .then(() => {
//     //     console.log("Login Successful! Redirecting to homepage..."); // Debugging
//     //     navigate("/");
//     //   })
//     //   .catch((err) => {
//     //     console.error("Login Failed:", err); // Debugging
//     //   });

//     dispatch(loginUser(formData))
//   .unwrap()
//   .then(() => {
//     const redirectPath = location.state?.from || "/";
//     navigate(redirectPath, { replace: true });
//   })
//   .catch((err) => {
//     console.error("Login Failed:", err);
//   });

//   };




 

// // 

//   return (
//     <div className="container login-container">
//       <div className="card login-card">
//         <h2 className="text-center">Login</h2>

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
//             <label className="form-label">Password</label>
//             <input
//               type="password"
//               className="form-control"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <button type="submit" className="btn btn-primary w-100" disabled={loading}>
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         <p className="mt-3 text-center">
//   <a href="/forgot-password">Forgot Password?</a> | 
//   Don't have an account? <a href="/signup">Sign Up</a>
// </p>

//       </div>
//     </div>
//   );
// };

// export default Login;


// import React, { useState , useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// // import { useNavigate } from "react-router-dom";
// import { useNavigate, useLocation } from "react-router-dom";
// import { loginUser } from "../../redux/AuthSlice"; // Import Redux action
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./Login.css"; // Custom CSS file

// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//     const location = useLocation();
//   const { loading, error, user } = useSelector((state) => state.auth); // Get state from Redux

//   console.log("Auth State in Login Component:", { loading, error, user }); // Debugging

//   // Handle Input Change
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };





// useEffect(() => {
//   console.log("Location state in Login:", location.state);
// }, [location]);

// const handleSubmit = async (e) => {
//   e.preventDefault();
  
//   const result = await dispatch(loginUser(formData));
  
//   if (result.success) { // Check the returned success status
//     const redirectPath = location.state?.from || "/";
//     console.log("Redirecting to:", redirectPath);
//     navigate(redirectPath, { replace: true });
//   }
//   // Errors are already handled by the thunk
// };




 

// // 

//   return (
//     <div className="container login-container">
//       <div className="card login-card">
//         <h2 className="text-center">Login</h2>

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
//             <label className="form-label">Password</label>
//             <input
//               type="password"
//               className="form-control"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <button type="submit" className="btn btn-primary w-100" disabled={loading}>
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         {/* <p className="mt-3 text-center">
//   <a href="/forgot-password">Forgot Password?</a> | 
//   Don't have an account? <a href="/signup">Sign Up</a>
// </p> */}
// <p className="mt-3 text-center">
//   <button 
//     className="btn btn-link p-0" 
//     onClick={() => navigate('/forgot-password', { state: location.state })}
//   >
//     Forgot Password?
//   </button> | 
//   Don't have an account?{' '}
//   <button 
//     className="btn btn-link p-0" 
//     onClick={() => navigate('/signup', { state: location.state })}
//   >
//     Sign Up
//   </button>
// </p>

//       </div>
//     </div>
//   );
// };

// export default Login;




import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../../redux/AuthSlice";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import { FcGoogle } from "react-icons/fc";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector((state) => state.auth);
  const [showModal, setShowModal] = useState(true);
console.log("Location state in Login:", location);
  useEffect(() => {
    console.log("Location state in Login:", location.state);
  }, [location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(formData));
    console.log("Login result:", result);
    if (result.payload?.success) {
      const redirectPath = location.state?.from?.pathname || "/";
      console.log("Redirecting to in conditon :", redirectPath);
      navigate(redirectPath, { replace: true });
    }
       const redirectPath = location.state?.from?.pathname || "/";
      console.log("Redirecting to out conditin:", redirectPath);
      navigate(redirectPath, { replace: true });
    // const redirectPath = location.state?.from?.pathname;
    // console.log("Redirecting to:", redirectPath);
    // navigate("/"); // Close the modal after successful login
  };

  const handleGoogleLogin = () => {
    const redirectPath = location.state?.from?.pathname || "/";
    console.log("Redirecting to Google login with path:", redirectPath);
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/auth/google?redirectPath=${encodeURIComponent(redirectPath)}`;
  };

  return (
    <Modal 
      show={showModal} 
      onHide={() => navigate("/")} 
      centered
      size="lg"
      className="login-modal"
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="w-100 text-center">
          <h3 className="fw-bold">Welcome Back</h3>
          <p className="text-muted">Sign in to continue</p>
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
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
                placeholder="Email Address"
                value={formData.email}
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
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </Form.Group>

          <Button 
            variant="primary" 
            type="submit" 
            className="w-100 py-2 mb-3 login-btn"
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
                Signing in...
              </>
            ) : (
              <>
                Sign In <FiArrowRight className="ms-2" />
              </>
            )}
          </Button>
        </Form>

        <div className="d-flex align-items-center my-3">
          <hr className="flex-grow-1" />
          <span className="px-3 text-muted">or</span>
          <hr className="flex-grow-1" />
        </div>

        <Button 
          variant="outline-dark" 
          onClick={handleGoogleLogin}
          className="w-100 d-flex align-items-center justify-content-center py-2 mb-3 google-btn"
        >
          <FcGoogle size={20} className="me-2" />
          Continue with Google
        </Button>

        <div className="d-flex justify-content-between">
          <Button 
            variant="link" 
            className="p-0 text-decoration-none"
            onClick={() => navigate('/forgot-password', { state: location.state })}
          >
            Forgot password?
          </Button>
          
          <Button 
            variant="link" 
            className="p-0 text-decoration-none"
            onClick={() => navigate('/signup', { state: location.state })}
          >
            Create account
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Login;