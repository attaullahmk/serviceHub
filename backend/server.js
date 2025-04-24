// const app = require("./app");
// const dotenv = require("dotenv");
// require("dotenv").config();

// // Load environment variables
// dotenv.config();


// const PORT = process.env.PORT || 3000;
// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });



// const app = require("./app");
// const dotenv = require("dotenv");
// const http = require("http");
// const { Server } = require("socket.io");

// // Load environment variables
// dotenv.config();

// // Create an HTTP server using Express
// const server = http.createServer(app);

// // Initialize Socket.io
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173", // Allow frontend requests
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     credentials: true,
//   },
// });

// const users = {}; // Store connected users

// // Handle socket connection
// io.on("connection", (socket) => {
//   console.log("A user connected:", socket.id);

//   // When a user joins, store their ID and notify others
//   socket.on("join", (userId) => {
//     users[userId] = socket.id;
//     console.log(`${userId} is online`);

//     // Emit updated online users list
//     io.emit("onlineUsers", Object.keys(users));
//   });

//   // Handle sending messages
//   socket.on("sendMessage", (messageData) => {
//     const { receiverId, senderId, content } = messageData;
//     console.log("New message:", messageData);

//     // Send message to receiver if online
//     if (users[receiverId]) {
//       io.to(users[receiverId]).emit("receiveMessage", messageData);
//     }
//   });

//   // Handle user disconnect
//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
    
//     // Find the disconnected user and remove from the list
//     Object.keys(users).forEach((userId) => {
//       if (users[userId] === socket.id) {
//         delete users[userId];
//       }
//     });

//     // Emit updated online users list
//     io.emit("onlineUsers", Object.keys(users));
//   });
// });
 
// // Start the server
// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
 
const app = require("./app");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const Notification = require("./models/notification"); // ✅ import your model

// Load environment variables
dotenv.config();

// Create an HTTP server using Express
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  },
});

const users = {}; // Store connected users

// Handle socket connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // When a user joins, store their ID and notify others
  socket.on("join", (userId) => {
    users[userId] = socket.id;
    console.log(`${userId} is online`);
    io.emit("onlineUsers", Object.keys(users));
  });

  // ✅ Handle real-time notification
  socket.on("sendNotification", async ({ recipientId, type, message }) => {
    try {
      // Save to database
      const newNotification = await Notification.create({
        recipient: recipientId,
        type,
        message,
      });

      const recipientSocketId = users[recipientId];
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("receiveNotification", newNotification);
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    Object.keys(users).forEach((userId) => {
      if (users[userId] === socket.id) {
        delete users[userId];
      }
    });

    io.emit("onlineUsers", Object.keys(users));
  });
});

// Export users and io for use in other files
console.log("Users connected:", users);
module.exports = { users, io };

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

