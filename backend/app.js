const express = require("express");
const app = express();
const connectDB = require("./config/db"); // Import the database connection function
// const cors = require("cors");
require("dotenv").config(); // To load environment variables
let passport = require("passport");
const jwt = require("jsonwebtoken");
const ExpressError = require("./utils/ExpressError");
// const passport = require("passport");
require("./config/passport"); // Ensure this file contains your Google Strategy setup

// Connect to the database
connectDB();

// Middleware

// In your server.js or app.js (backend)
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from your frontend origin
  credentials: true, // If you need to send cookies or authorization headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow necessary HTTP methods
  // allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
}));




app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Passport middleware
app.use(passport.initialize());

// Routes
const authRoutes = require("./routes/authRoutes");
const serviceProviderRoutes = require("./routes/serviceProviderRoutes");
const userRoutes = require("./routes/userRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const messageRoutes = require("./routes/messageRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const faqRoutes = require("./routes/faqRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
 
// Route Middlewares
app.use("/api/auth", authRoutes); 
app.use("/api/serviceProviders", serviceProviderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/categories", categoryRoutes); 
app.use("/api/reviews", reviewRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/conversations", conversationRoutes);


const authenticateJWT = require("./middlewares/authenticateJWT");

// Profile route (protected by JWT)
app.get("/profile", authenticateJWT, (req, res) => {
  res.json({
    success: true,
    message: `Welcome ${req.user.email}`,
  });
});

// Default route 
app.get("/", (req, res) => {
  res.send('<a href="http://localhost:3000/api/auth/google">Sign in with Google</a>');
  // res.send(<h1> this is api </h1>)

});

// Google OAuth routes (unchanged)
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), (req, res) => {
//   res.redirect("/frofile");
// });

app.get("/frofile", (req, res) => {
  res.send(`<h1>Welcome ${req.user}</h1>`);
});

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect("/");
  });
});

app.get("/dashboard", (req, res) => {
  res.json({
    name: "Jane Smith",
    email: "hi",
  });
});

app.get("/login", (req, res) => {
  res.json({
    name: " render your login page ",
    email: "hi",
  });
});

// Error-handling middleware
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong!" } = err;

  // Handle authentication errors
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ success: false, message: "Unauthorized access" });
  }
console.log("EERROORR")
  console.error(err.stack); // Log error for debugging
  res.status(status).json({
    success: false,
    message,
  });
});

// 404 Handler
app.all("*", (req, res, next) => {
  // next(new ExpressError(404, "Page not found"));
  console.log("hi")
});
 
// Export the app
module.exports = app;
