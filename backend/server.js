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
 









// server.js

const app = require("./app");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const Notification = require("./models/notification");
const Message = require("./models/message"); // ✅ Add message model
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

// Store connected users
const users = {};

// Handle socket connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Store user socket ID on join
  socket.on("join", (userId) => {
    users[userId] = socket.id;
    console.log(`${userId} is online`);
    io.emit("onlineUsers", Object.keys(users));
  });

  // Handle real-time notification
  socket.on("sendNotification", async ({ recipientId, type, message, targetId, targetType }) => {
    try {
      // Save the notification to the database
      const newNotification = await Notification.create({
        recipient: recipientId,
        type,
        message,
        targetId,
        targetType,
        isRead: false,
      });

      console.log("Notification saved:", newNotification);

      // Send the notification to the recipient if online
      const recipientSocketId = users[recipientId];
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("newNotification", newNotification);
        console.log(`Notification sent to user ${recipientId}`);
      } else {
        console.log(`User ${recipientId} is offline, notification saved for later.`);
      }
    } catch (error) {
      console.error("Error saving notification:", error);
    }
  });



    // Handle real-time message
    socket.on("sendMessage", async (messageData) => {
      try {
        // Save message to the database
        const newMessage = await Message.create(messageData);
  
        console.log("New message saved:", newMessage);
  
        // Send the message to the receiver if online
        const recipientSocketId = users[messageData.receiverId];
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("receiveMessage", newMessage);
          console.log(`Message sent to user ${messageData.receiverId}`);
        }
      } catch (error) {
        console.error("Error saving message:", error);
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
  
  // Handle user disconnect
//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);

//     Object.keys(users).forEach((userId) => {
//       if (users[userId] === socket.id) {
//         delete users[userId];
//       }
//     });

//     io.emit("onlineUsers", Object.keys(users));
//   });
// });

// Export users and io for use in other files
module.exports = { users, io };

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



