import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';

// Layouts
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

// Pages
import Home from "../components/home/Home";
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";  // Import Forgot Password Page
import ResetPassword from "../pages/auth/ResetPassword";  // Import Reset Password Page
import Signup from "../pages/auth/Signup";
import ServiceProviderDashboard from "../pages/service-providers/ServiceProviderDashboard";
import Services from "../pages/services/Services";
import ServiceDetail from "../pages/services/ServiceDetail";
import EditServiceForm from "../pages/services/EditServiceForm";
import Categories from "../pages/categories/Categories";
import CategoryDetail from "../pages/categories/CategoryDetail";
import Bookings from "../pages/bookings/Bookings";
import Messages from "../pages/messages/Messages";
import Profile from "../pages/profile/Profile";
import NotFound from "../pages/auth/NotFound";
import Provider from '../pages/service-providers/serviceProviderForm'
import ServiceForm from "../pages/services/ServiceForm";

const AppRoutes = () => {
  const { user } = useSelector((state) => state.auth); // Get user from Redux

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes with Main Layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:id" element={<CategoryDetail />} />
        </Route>

        {/* Auth Layout Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />

          {/* ✅ Forgot & Reset Password Routes */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* Protected Routes with Main Layout */}
        <Route element={<MainLayout />}>
          <Route path="/bookings" element={user ? <Bookings /> : <Navigate to="/login" />} />
          <Route path="/messages" element={user ? <Messages /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/provider" element={user ? <Provider /> : <Navigate to="/login" />} />
          <Route path="/createService" element={user ? <ServiceForm/> : <Navigate to="/login" />} />
          <Route path="/editService/:id" element={user ? <EditServiceForm/> : <Navigate to="/login" />} />
          <Route path="/provider/dashboard" element={user ? <ServiceProviderDashboard /> : <Navigate to="/login" />} />
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
};

export default AppRoutes;
