// import { Routes, Route, Navigate } from "react-router-dom";
// import { useSelector } from "react-redux";

// import Navbar from '../components/navbar/Navbar';
// import Footer from '../components/footer/Footer';

// // Layouts
// import MainLayout from "../layouts/MainLayout";
// import AuthLayout from "../layouts/AuthLayout";

// // Pages
// import Home from "../components/home/Home";
// import Login from "../pages/auth/Login";
// import ForgotPassword from "../pages/auth/ForgotPassword";  // Import Forgot Password Page
// import ResetPassword from "../pages/auth/ResetPassword";  // Import Reset Password Page
// import Signup from "../pages/auth/Signup";
// import ServiceProviderDashboard from "../pages/service-providers/ServiceProviderDashboard";
// import Services from "../pages/services/Services";
// import ServiceDetail from "../pages/services/ServiceDetail";
// import EditServiceForm from "../pages/services/EditServiceForm";
// import Categories from "../pages/categories/Categories";
// import CategoryDetail from "../pages/categories/CategoryDetail";
// import Bookings from "../pages/bookings/MyBookings";
// import Messages from "../pages/messages/MessageBox";
// import Profile from "../pages/profile/Profile";
// import NotFound from "../pages/auth/NotFound";
// import Provider from '../pages/service-providers/serviceProviderForm'
// import ServiceForm from "../pages/services/ServiceForm";

// const AppRoutes = () => {
//   const { user } = useSelector((state) => state.auth); // Get user from Redux

//   return (
//     <>
//       <Navbar />
//       <Routes>
//         {/* Public Routes with Main Layout */}
//         <Route element={<MainLayout />}>
//           <Route path="/" element={<Home />} />
//           <Route path="/services" element={<Services />} />
//           <Route path="/services/:id" element={<ServiceDetail />} />
//           <Route path="/categories" element={<Categories />} />
//           <Route path="/categories/:id" element={<CategoryDetail />} />
//         </Route>

//         {/* Auth Layout Routes */}
//         <Route element={<AuthLayout />}>
//           <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
//           <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />

//           {/* ✅ Forgot & Reset Password Routes */}
//           <Route path="/forgot-password" element={<ForgotPassword />} />
//           <Route path="/reset-password" element={<ResetPassword />} />
//         </Route>

//         {/* Protected Routes with Main Layout */}
//         <Route element={<MainLayout />}>
//           <Route path="/bookings" element={user ? <Bookings /> : <Navigate to="/login" />} />
//           <Route path="/messages" element={user ? <Messages /> : <Navigate to="/login" />} />
//           <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
//           <Route path="/provider" element={user ? <Provider /> : <Navigate to="/login" />} />
//           <Route path="/createService" element={user ? <ServiceForm/> : <Navigate to="/login" />} />
//           <Route path="/editService/:id" element={user ? <EditServiceForm/> : <Navigate to="/login" />} />
//           <Route path="/provider/dashboard" element={user ? <ServiceProviderDashboard /> : <Navigate to="/login" />} />
//         </Route>

//         {/* 404 Not Found */}
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//       {/* <Footer /> */}
//     </>
//   );
// };

// export default AppRoutes;






import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Navbar from '../components/navbar/Navbar';
// import Footer from '../components/footer/Footer'; // Optional

// Layouts
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

// Pages
import Home from "../components/home/Home";
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import Signup from "../pages/auth/Signup";
import ServiceProviderDashboard from "../pages/service-providers/ServiceProviderDashboard";
import Services from "../pages/services/Services";
import ServiceDetail from "../pages/services/ServiceDetail";
import EditServiceForm from "../pages/services/EditServiceForm";
import Categories from "../pages/categories/Categories";
import CategoryDetail from "../pages/categories/CategoryDetail";
import Bookings from "../pages/bookings/MyBookings";
import Messages from "../pages/messages/MessageBox";
import Profile from "../pages/profile/Profile";
import NotFound from "../pages/auth/NotFound";
import Provider from '../pages/service-providers/serviceProviderForm';
import ServiceForm from "../pages/services/ServiceForm";

const AppRoutes = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <Navbar />
      <Routes>

        {/* Public Routes */}
        <Route element={<MainLayout  />}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          {/* <Route path="/services/:id" element={<ServiceDetail />} /> */}
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:id" element={<CategoryDetail />} />
        </Route>

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* ✅ Protected Routes with MainLayout and requireAuth */}
        <Route element={<MainLayout requireAuth={true} />}>
         <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/provider" element={<Provider />} />
          <Route path="/createService" element={<ServiceForm />} />
          <Route path="/editService/:id" element={<EditServiceForm />} />
          <Route path="/provider/dashboard" element={<ServiceProviderDashboard />} />
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default AppRoutes;





































// import { Routes, Route } from "react-router-dom";
// import Navbar from '../components/navbar/Navbar';
// import Footer from '../components/footer/Footer';

// // Layouts
// import MainLayout from "../layouts/MainLayout";
// import AuthLayout from "../layouts/AuthLayout";

// // Pages
// import Home from "../components/home/Home";
// import Login from "../pages/auth/Login";
// import ForgotPassword from "../pages/auth/ForgotPassword";
// import ResetPassword from "../pages/auth/ResetPassword";
// import Signup from "../pages/auth/Signup";
// import ServiceProviderDashboard from "../pages/service-providers/ServiceProviderDashboard";
// import Services from "../pages/services/Services";
// import ServiceDetail from "../pages/services/ServiceDetail";
// import EditServiceForm from "../pages/services/EditServiceForm";
// import Categories from "../pages/categories/Categories";
// import CategoryDetail from "../pages/categories/CategoryDetail";
// import Bookings from "../pages/bookings/MyBookings";
// import Messages from "../pages/messages/MessageBox";
// import Profile from "../pages/profile/Profile";
// import NotFound from "../pages/auth/NotFound";
// import Provider from '../pages/service-providers/serviceProviderForm';
// import ServiceForm from "../pages/services/ServiceForm";

// // Private Route
// import PrivateRoute from "../utils/PrivateRoute";

// const AppRoutes = () => {
//   return (
//     <>
//       <Navbar />
//       <Routes>
//         {/* Public Routes */}
//         <Route element={<MainLayout />}>
//           <Route path="/" element={<Home />} />
//           <Route path="/services" element={<Services />} />
//           <Route path="/services/:id" element={<ServiceDetail />} />
//           <Route path="/categories" element={<Categories />} />
//           <Route path="/categories/:id" element={<CategoryDetail />} />
//         </Route>

//         {/* Auth Routes */}
//         <Route element={<AuthLayout />}>
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/forgot-password" element={<ForgotPassword />} />
//           <Route path="/reset-password" element={<ResetPassword />} />
//         </Route>

//         {/* Protected Routes */}
//         <Route element={<MainLayout />}>
//           <Route
//             path="/bookings"
//             element={
//               <PrivateRoute>
//                 <Bookings />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/messages"
//             element={
//               <PrivateRoute>
//                 <Messages />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/profile"
//             element={
//               <PrivateRoute>
//                 <Profile />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/provider"
//             element={
//               <PrivateRoute>
//                 <Provider />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/createService"
//             element={
//               <PrivateRoute>
//                 <ServiceForm />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/editService/:id"
//             element={
//               <PrivateRoute>
//                 <EditServiceForm />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/provider/dashboard"
//             element={
//               <PrivateRoute>
//                 <ServiceProviderDashboard />
//               </PrivateRoute>
//             }
//           />
//         </Route>

//         {/* 404 Not Found */}
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//       {/* <Footer /> */}
//     </>
//   );
// };

// export default AppRoutes;
