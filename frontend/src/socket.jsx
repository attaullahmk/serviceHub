// // src/socket.js
// import { io } from "socket.io-client";
// const BASE_URL = import.meta.env.VITE_API_BASE_URL;


// const socket = io("http://localhost:3000"); // Make sure the port matches your backend
// export default socket;

// src/socket.js
// import { io } from "socket.io-client";

// const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

// const socket = io(SOCKET_URL, {
//   transports: ["websocket"],
//   autoConnect: false,
// });

// socket.on("connect", () => console.log("✅ Socket connected:", socket.id));
// socket.on("disconnect", (reason) => console.log("❌ Socket disconnected:", reason));
// socket.on("reconnect", (attempt) => console.log("🔄 Socket reconnected after", attempt, "attempts"));

// export default socket;


// src/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: true,
  reconnectionAttempts: Infinity,
});

export default socket;
