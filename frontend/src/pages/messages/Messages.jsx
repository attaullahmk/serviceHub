import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Button, Card, Form, InputGroup, ListGroup } from "react-bootstrap";
import { FiMessageSquare, FiSend } from "react-icons/fi";
import "./Messages.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const MessageBox = ({ receiverId }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messageBoxRef = useRef(null);
  const messagesEndRef = useRef(null);
  const { user } = useSelector((state) => state.auth); // Get user from Redux
  const senderId = user ? user._id : null;
  const navigate = useNavigate(); // Hook for navigation

  const handleToggleVisibility = () => {
    if (!senderId) {
      // Redirect to login page if senderId is null
      navigate("/login");
    } else {
      setIsVisible(!isVisible);
    }
  };

  useEffect(() => {
    if (isVisible) {
      fetchConversations();
    }
  }, [isVisible]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (messageBoxRef.current && !messageBoxRef.current.contains(event.target)) {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible]);

  const fetchConversations = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/conversations/${senderId}/${receiverId}`);
      if (response.data.success) {
        setSelectedConversation(response.data.data);
      } else {
        createConversation();
      }
    } catch (error) {
      console.error("Error fetching conversation:", error);
      createConversation();
    }
  };

  const createConversation = async () => {
    try {
      console.log("creat", senderId, receiverId);
      const response = await axios.post("http://localhost:3000/api/conversations", {
        participants: [senderId, receiverId],
      });
      if (response.data.success) {
        setSelectedConversation(response.data.data);
      }
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/messages/conversation/${conversationId}`);
      if (response.data.success) {
        setMessages(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const response = await axios.post("http://localhost:3000/api/messages", {
        conversationId: selectedConversation._id,
        sender: senderId,
        receiver: receiverId,
        content: newMessage,
      });

      if (response.data.success) {
        setMessages([...messages, response.data.data]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div>
      <Button
        className="position-fixed bottom-0 end-0 m-3 rounded-circle d-flex align-items-center justify-content-center message-button"
        variant="primary"
        onClick={handleToggleVisibility}
      >
        <FiMessageSquare size={24} />
      </Button>

      {isVisible && (
        <Card ref={messageBoxRef} className="position-fixed bottom-0 end-0 m-3 p-3 message-box">
          <Card.Body>
            <Card.Title className="text-center">Chat</Card.Title>
            {!selectedConversation ? (
              <ListGroup>
                {conversations.length === 0 ? (
                  <p className="text-muted text-center">No conversations yet...</p>
                ) : (
                  conversations.map((conv) => (
                    <ListGroup.Item
                      key={conv._id}
                      action
                      onClick={() => setSelectedConversation(conv)}
                    >
                      {conv.participants.find((p) => p._id !== senderId)?.name || "Unknown"}
                    </ListGroup.Item>
                  ))
                )}
              </ListGroup>
            ) : (
              <>
                <Button variant="secondary" size="sm" onClick={() => setSelectedConversation(null)}>
                  Back to Conversations
                </Button>
                <div className="message-list">
                  {messages.length === 0 ? (
                    <p className="text-muted text-center">No messages yet...</p>
                  ) : (
                    messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`message ${msg.sender._id === senderId ? "sent" : "received"}`}
                      >
                        <strong>{msg.sender._id === senderId ? "You" : msg.receiver?.name || "Unknown"}:</strong> {msg.content}
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <InputGroup className="mt-2">
                  <Form.Control
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  />
                  <Button variant="primary" onClick={sendMessage}>
                    <FiSend />
                  </Button>
                </InputGroup>
              </>
            )}
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default MessageBox;