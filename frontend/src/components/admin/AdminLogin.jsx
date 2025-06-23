// import { useState } from "react";
// import axios from "axios";
// const BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const AdminLogin = () => {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [error, setError] = useState("");

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {

//     const res = await axios.post(`${BASE_URL}/admin/login`, form);
//       localStorage.setItem("adminToken", res.data.token);
//       window.location.href = "/admin/dashboard";
//     } catch (err) {
//       setError(err.response?.data?.error || "Login failed");
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <h2>Admin Login</h2>
//       <form onSubmit={handleSubmit}>
//         <input name="email" type="email" placeholder="Email" className="form-control mb-2" onChange={handleChange} required />
//         <input name="password" type="password" placeholder="Password" className="form-control mb-2" onChange={handleChange} required />
//         <button type="submit" className="btn btn-primary w-100">Login</button>
//         {error && <div className="alert alert-danger mt-2">{error}</div>}
//       </form>
//     </div>
//   );
// };

// export default AdminLogin;


import { useState } from "react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import "./AdminLogin.css";

const AdminLogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/admin/login`, form);
      localStorage.setItem("adminToken", res.data.token);
      window.location.href = "/admin/dashboard";
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="login-header">
          <h2>Admin Portal</h2>
          <p>Sign in to your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? (
              <span className="spinner"></span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;