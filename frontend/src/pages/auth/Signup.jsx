import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/authSlice";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    otp: "",
  });

  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendOtp = async () => {
    try {
      await axios.post("http://localhost:3000/api/auth/send-otp", { email: formData.email });
      setOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const verifyOtpAndSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:3000/api/auth/verify-otp", formData);
      const { token, user } = response.data;

      localStorage.setItem("authToken", token);
      dispatch(loginSuccess({ user, token }));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed!");
    }
  };

  return (
    <div className="container signup-container">
      <div className="card signup-card">
        <h2 className="text-center">Sign Up</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        {!otpSent ? (
          <form onSubmit={(e) => { e.preventDefault(); sendOtp(); }}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
            </div>

            <button type="submit" className="btn btn-primary w-100">Send OTP</button>
          </form>
        ) : (
          <form onSubmit={verifyOtpAndSignup}>
            <div className="mb-3">
              <label className="form-label">OTP</label>
              <input type="text" className="form-control" name="otp" value={formData.otp} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
            </div>

            <button type="submit" className="btn btn-primary w-100">Verify OTP & Sign Up</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Signup;
