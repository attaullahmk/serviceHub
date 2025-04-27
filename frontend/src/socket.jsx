// src/socket.js
import { io } from "socket.io-client";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;


const socket = io("http://localhost:3000"); // Make sure the port matches your backend
export default socket;
