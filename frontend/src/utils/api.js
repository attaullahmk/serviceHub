import axios from "axios";

const API_BASE_URL = "http://localhost:3000//api/messages"; // Change based on your backend URL

export const createConversation = async (participants) => {
  return axios.post(`${API_BASE_URL}/conversations`, { participants });
};

export const getConversationsForUser = async (userId) => {
  return axios.get(`${API_BASE_URL}/conversations/${userId}`);
};

export const createMessage = async (conversationId, sender, content) => {
  return axios.post(`${API_BASE_URL}/messages`, { conversationId, sender, content });
};

export const getMessagesByConversation = async (conversationId) => {
  return axios.get(`${API_BASE_URL}/messages/${conversationId}`);
};
