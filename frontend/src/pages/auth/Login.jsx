import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../redux/AuthSlice"; // Import Redux action
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css"; // Custom CSS file

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth); // Get state from Redux

  console.log("Auth State in Login Component:", { loading, error, user }); // Debugging

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData); // Debugging
    dispatch(loginUser(formData, navigate))
      .unwrap() // Unwrap the promise to handle success/error
      .then(() => {
        console.log("Login Successful! Redirecting to homepage..."); // Debugging
        navigate("/");
      })
      .catch((err) => {
        console.error("Login Failed:", err); // Debugging
      });
  };

  return (
    <div className="container login-container">
      <div className="card login-card">
        <h2 className="text-center">Login</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-3 text-center">
  <a href="/forgot-password">Forgot Password?</a> | 
  Don't have an account? <a href="/signup">Sign Up</a>
</p>

      </div>
    </div>
  );
};

export default Login;