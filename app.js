const express = require("express");
const app = express();
const mongoose = require("mongoose")

const connectDB = require('./config/db'); // Import the database connection function

// const { default: mongoose } = require("mongoose");
connectDB();


// const cors = require("cors");
// // Middleware
// app.use(cors());
// app.use(express.json());




app.get("/", (req, res) => {
  res.send("Welcome to ServiceHub!");
});

module.exports = app;
