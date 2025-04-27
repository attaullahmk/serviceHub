import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import MessageInput from "./MessageInput";
import MessageBubble from "./MessageBubble";
import socket from "../../socket";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ChatWindow = ({ conversation, setSelectedConversation, senderId, receiverId, user }) => {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/messages/conversation/${conversation._id}`);
        if (res.data.success) setMessages(res.data.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, [conversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;
    try {
      const res = await axios.post(`${BASE_URL}/api/messages`, {
        conversationId: conversation._id,
        sender: senderId,
        receiver: receiverId,
        content: text,
      });

      if (res.data.success) {
        setMessages((prev) => [...prev, res.data.data]);

        const receiver = conversation.participants.find(p => p._id !== senderId)?._id;
        socket.emit("sendNotification", {
          recipientId: receiver,
          type: "promotion",
          message: `You have a new message from ${user.name}`,
        });
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setSelectedConversation(null)}>
        Back to Conversations
      </Button>
      <div className="message-list">
        {messages.length === 0 ? (
          <p className="text-muted text-center">No messages yet...</p>
        ) : (
          messages.map((msg, index) => (
            <MessageBubble key={index} message={msg} senderId={senderId} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <MessageInput onSend={handleSendMessage} />
    </>
  );
};

export default ChatWindow;
