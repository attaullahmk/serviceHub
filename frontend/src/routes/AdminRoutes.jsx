// import { Routes, Route, Navigate } from "react-router-dom";
// import AdminLogin from "../components/admin/AdminLogin";
// import AdminDashboard from "../components/admin/AdminDashboard";
// // import ManageServices from "../components/admin/ManageServices";
// // import ManageUsers from "../components/admin/ManageUsers";
// // import ManageBookings from "../components/admin/ManageBookings";

// const AdminRoutes = () => {
//   const token = localStorage.getItem("adminToken");

//   if (!token && window.location.pathname !== "/admin/login") {
//     return <Navigate to="/admin/login" />;
//   }

//   return (
//     <Routes>
//       <Route path="/admin/login" element={<AdminLogin />} />
//       <Route path="/admin/dashboard" element={<AdminDashboard />} />
//       {/* <Route path="/admin/services" element={<ManageServices />} /> */}
//       {/* <Route path="/admin/users" element={<ManageUsers />} /> */}
//       {/* <Route path="/admin/bookings" element={<ManageBookings />} /> */}
//     </Routes>
//   );
// };

// export default AdminRoutes;



import { Routes, Route } from "react-router-dom";
import AdminLogin from "../components/admin/AdminLogin";
import AdminDashboard from "../components/admin/AdminDashboard";
import ManageServices from "../components/admin/ManageServices";
import ManageUsers from "../components/admin/ManageUsers";
import ManageBookings from "../components/admin/ManageBookings";
import RequireAdminAuth from "../middlewares/RequireAdminAuth";
import AdminServiceDetail from "../components/admin/AdminServiceDetail";



const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route
        path="/admin/dashboard"
        element={
          <RequireAdminAuth>
            <AdminDashboard />
          </RequireAdminAuth>
        }
      />
      <Route
        path="/admin/services"
        element={
          <RequireAdminAuth>
            <ManageServices />
          </RequireAdminAuth>
        }
      />
      <Route
        path="/admin/users"
        element={
          <RequireAdminAuth>
            <ManageUsers />
          </RequireAdminAuth>
        }
      />
      <Route
        path="/admin/bookings"
        element={
          <RequireAdminAuth>
            <ManageBookings />
          </RequireAdminAuth>
        }
      />
      <Route path="/admin/services/:id" element={<RequireAdminAuth><AdminServiceDetail /></RequireAdminAuth>} />
    </Routes>
    
  );
};

export default AdminRoutes;
