const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config(); // Ensure you load environment variables

const authenticateJWT = async (req, res, next) => {
  // console.log("thi is middle ware ")
  const token = req.header("Authorization")?.split(" ")[1]; // Get token from "Bearer TOKEN"
  // console.log("token middlware ", token)
// console.log(token);
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId)
    .select("-password")
    .catch(err => console.error("Database error:", err));   


    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // Attach user to request
    // console.log( "user", user)
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticateJWT;
