import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, ListGroup, Badge } from "react-bootstrap";
import socket from "../../socket";

const ConversationList = ({ senderId, receiverId, serviceId, setSelectedConversation }) => {
  const [conversations, setConversations] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/conversations/sender/${senderId}/service/${serviceId}`);
        if (res.data.success) setConversations(res.data.data);
      } catch (err) {
        console.error("Error fetching conversations:", err);
      }
    };

    fetchConversations();
  }, [senderId, serviceId]);

  useEffect(() => {
    if (senderId) socket.emit("join", senderId);

    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => socket.off("onlineUsers");
  }, [senderId]);

  const createConversation = async () => {
    try {
      const res = await axios.post("http://localhost:3000/api/conversations", {
        participants: [senderId, receiverId],
        service: serviceId,
      });

      if (res.data.success) {
        setConversations((prev) => [...prev, res.data.data]);
        setSelectedConversation(res.data.data);
      }
    } catch (err) {
      console.error("Error creating conversation:", err);
    }
  };

  return (
    <>
      <Card.Title className="text-center">Your Conversations</Card.Title>
      {conversations.length === 0 ? (
        <div className="text-center">
          <p className="text-muted">No conversations found.</p>
          <Button variant="primary" onClick={createConversation}>Start a Conversation</Button>
        </div>
      ) : (
        <ListGroup>
          {conversations.map((conv) => {
            const participant = conv.participants.find((p) => p._id !== senderId);
            return (
              <ListGroup.Item key={conv._id} action onClick={() => setSelectedConversation(conv)}>
                Chat with {participant?.name || "Unknown"}
                {onlineUsers.includes(participant?._id) && <Badge bg="success" className="ms-2">Online</Badge>}
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      )}
    </>
  );
};

export default ConversationList;
