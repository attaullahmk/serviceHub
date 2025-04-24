// src/socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // Make sure the port matches your backend
export default socket;
