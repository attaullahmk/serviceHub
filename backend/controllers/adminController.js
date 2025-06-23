const Admin = require("../models/admin");
const User = require("../models/user");
const Service = require("../models/service");
const Booking = require("../models/booking");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// 🔐 Generate Admin Token
const generateToken = (admin) => {
  return jwt.sign({ id: admin._id, role: "admin" }, JWT_SECRET, { expiresIn: "7d" });
};

// ✅ Admin Login
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(admin);

    res.status(200).json({
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        permissions: admin.permissions,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// 👤 Get Admin Profile
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select("-password");
    if (!admin) return res.status(404).json({ error: "Admin not found" });

    res.status(200).json(admin);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// 📊 Admin Dashboard Stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalProviders = await User.countDocuments({ role: "provider" });
    const totalServices = await Service.countDocuments();
    const totalBookings = await Booking.countDocuments();

    res.status(200).json({
      totalUsers,
      totalProviders,
      totalServices,
      totalBookings,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
};

/////////////////////// USERS ///////////////////////

// 👥 Get All Users and Providers
// exports.getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find({ role: { $in: ["user", "provider"] } }).select("-password");
//     res.status(200).json({ users });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch users" });
//   }
// };
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    // res.status(200).json({
    //   success: true,
    //   users,
    // });
    console.log("Fetched users:", users);
         res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: err.message,
    });
  }
};

// ❌ Delete User or Provider
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    await user.deleteOne(); // Cascade deletion handled in pre hook
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

/////////////////////// SERVICES ///////////////////////

// 🔍 Get All Services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find().populate("provider", "name email");
    res.status(200).json({ services });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch services" });
  }
};

// ✅ Approve a Service
exports.approveService = async (req, res) => {
  console.log("Approving service:")
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      {   status: "approved" },
      { new: true }
    );
    console.log("Approving service:", req.params.id),
    console.log("Service after approval:", service);
    if (!service) return res.status(404).json({ error: "Service not found" });

    res.status(200).json({ message: "Service approved", service });
  } catch (err) {
    res.status(500).json({ error: "Failed to approve service" });
  }
};

// ❌ Reject a Service with Reason
exports.rejectService = async (req, res) => {
  try {
    const { rejectionReason } = req.body;

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      {
        status: "rejected",
        rejectionReason,
        // moderatedBy: req.user.id,
        // moderatedAt: new Date(),
      },
      { new: true }
    );
console.log("service after rejection:", service);
    if (!service) return res.status(404).json({ error: "Service not found" });

    res.status(200).json({ message: "Service rejected", service });
  } catch (err) {
    res.status(500).json({ error: "Failed to reject service" });
  }
};


// ❌ Delete a Service
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ error: "Service not found" });

    await service.deleteOne();
    res.status(200).json({ message: "Service deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete service" });
  }
};

// service detail 

// 🔍 Get Service by ID (Admin)
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate("provider", "name email") // Include provider basic info
      .populate("reviews"); // Optional: include reviews

    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    res.status(200).json({ service });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch service" });
  }
};


/////////////////////// BOOKINGS ///////////////////////

// 📋 Get All Bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("service", "title");

    res.status(200).json({ bookings });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

// ❌ Cancel a Booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    res.status(200).json({ message: "Booking cancelled", booking });
  } catch (err) {
    res.status(500).json({ error: "Failed to cancel booking" });
  }
};




// const Admin = require("../models/admin");
// const User = require("../models/user");

// ✅ Get all admins (excluding full/super admins)
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({ role: "admin" }).select("-password");
    res.status(200).json({ admins });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch admins" });
  }
};

// ✅ Promote a user to admin
// exports.addAdmin = async (req, res) => {
//   const { email } = req.body;
//   console.log("Adding admin for email:", email);
//   try {
//     const existingUser = await User.findOne({ email });

//     if (!existingUser) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Check if already admin
//     const existingAdmin = await Admin.findOne({ email });
//     if (existingAdmin) {
//       return res.status(400).json({ error: "User is already an admin" });
//     }
//     console.log("existingUser:", existingUser);

//     const newAdmin = new Admin({
//       name: existingUser.name,
//       email: existingUser.email,
//       password: existingUser.password,
//       // permissions: ["manage-users", "manage-services"],
//       role: "admin",
//     });

//     await newAdmin.save();
//     res.status(201).json({ message: "Admin added successfully" });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to add admin" });
//   }
// };


exports.addAdmin = async (req, res) => {
  const { name, email, password, role } = req.body;
  console.log("Adding admin with data:", { name, email, password, role });
  try {
    // Validate required fields from form
    if (!name || !email || !password || !role) {
      return res.status(400).json({ 
        success: false,
        error: "All fields are required (name, email, password, role)" 
      });
    }

    // Check if admin already exists with this email
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ 
        success: false,
        error: "Admin with this email already exists" 
      });
    }

    // Create new admin with form data
    const newAdmin = new Admin({
      name,
      email,
      password, // Stored as plain text (not recommended for production)
      role,
      createdAt: new Date()
    });

    await newAdmin.save();

    // Return success response without sensitive data
    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: {
        _id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
        createdAt: newAdmin.createdAt
      }
    });

  } catch (err) {
    console.error("Admin creation error:", err);
    res.status(500).json({ 
      success: false,
      error: "Failed to create admin",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};


// ❌ Delete an admin (by ID)
exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    await admin.deleteOne();
    res.status(200).json({ message: "Admin removed successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove admin" });
  }
};
