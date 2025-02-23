import { Outlet } from "react-router-dom";
import "./AuthLayout.css"; // Custom styling


const AuthLayout = () => {
  return (
    <div className="auth-container d-flex align-items-center justify-content-center">
      <div className="auth-card shadow-lg">
        {/* Logo */}
        <div className="text-center text">
          <img src= "/image/logo.jpg"alt="" className="auth-logo" />
          {/* <img src="/image/logo.jpg" alt="ServiceHub" className="logo" /> */}
        </div>

        {/* Page Title */}
        <h3 className="text-center mt-3">Welcome to ServiceHub </h3>
        <p className="text-center text-muted">Login or sign up to continue</p>

        {/* Outlet for rendering Login, Register, or Signup */}
        <main>
        <Outlet />
 
      </main>
        {/* <Outlet /> */}
      </div>
    </div>
  );
};

export default AuthLayout;
