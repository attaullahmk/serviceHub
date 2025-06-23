


const express = require("express");
const router = express.Router();

const {
  loginAdmin,
  getAdminProfile,
  getDashboardStats,
  getAllUsers,
  deleteUser,
  getAllServices,
  approveService,
  deleteService,
  getAllBookings,
  cancelBooking,
  rejectService,
    getServiceById,


  getAllAdmins,
  addAdmin,
  deleteAdmin,
} = require("../controllers/adminController");

const isAdmin = require("../middlewares/isAdmin");

// 🔓 Public
router.post("/login", loginAdmin);

// 🔐 Admin-only
router.get("/profile", isAdmin, getAdminProfile);
router.get("/dashboard", isAdmin, getDashboardStats);

// 🧑‍💼 Manage Admins
router.get("/manage-admins", isAdmin, getAllAdmins);
router.post("/manage-admins", isAdmin, addAdmin);
router.delete("/manage-admins/:id", isAdmin, deleteAdmin);


// 👥 Users
router.get("/users", isAdmin, getAllUsers);
router.delete("/users/:id", isAdmin, deleteUser);

// 🛠️ Services
router.get("/services", isAdmin, getAllServices);
router.patch("/services/:id/approve", isAdmin, approveService);
router.patch("/services/:id/reject", isAdmin, rejectService);
// 🧾 Get single service by ID (Admin)
router.get("/services/:id", isAdmin, getServiceById);


router.delete("/services/:id", isAdmin, deleteService);

// 📋 Bookings
router.get("/bookings", isAdmin, getAllBookings);
router.patch("/bookings/:id/cancel", isAdmin, cancelBooking);

module.exports = router;
