const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables

const MONGO_URL = process.env.MONGO_URL; // Read from .env

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URL); // No extra options needed
    console.log("✅ MongoDB Connected Successfully!");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1); // Exit if connection fails
  }
} 

module.exports = connectDB;
