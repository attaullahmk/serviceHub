// import { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { Button } from "react-bootstrap";
// import MessageInput from "./MessageInput";
// import MessageBubble from "./MessageBubble";
// import socket from "../../socket";
// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const ChatWindow = ({ conversation, setSelectedConversation, senderId, receiverId, user }) => {
//   const [messages, setMessages] = useState([]);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const res = await axios.get(`${BASE_URL}/api/messages/conversation/${conversation._id}`);
//         if (res.data.success) setMessages(res.data.data);
//       } catch (err) {
//         console.error("Error fetching messages:", err);
//       }
//     };

//     fetchMessages();
//   }, [conversation]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSendMessage = async (text) => {
//     if (!text.trim()) return;
//     try {
//       const res = await axios.post(`${BASE_URL}/api/messages`, {
//         conversationId: conversation._id,
//         sender: senderId,
//         receiver: receiverId,
//         content: text,
//       });

//       if (res.data.success) {
//         setMessages((prev) => [...prev, res.data.data]);

//         const receiver = conversation.participants.find(p => p._id !== senderId)?._id;
//         socket.emit("sendNotification", {
//           recipientId: receiver,
//           type: "promotion",
//           message: `You have a new message from ${user.name}`,
//         });
//       }
//     } catch (err) {
//       console.error("Error sending message:", err);
//     }
//   };

//   return (
//     <>
//       <Button variant="secondary" size="sm" onClick={() => setSelectedConversation(null)}>
//         Back to Conversations
//       </Button>
//       <div className="message-list">
//         {messages.length === 0 ? (
//           <p className="text-muted text-center">No messages yet...</p>
//         ) : (
//           messages.map((msg, index) => (
//             <MessageBubble key={index} message={msg} senderId={senderId} />
//           ))
//         )}
//         <div ref={messagesEndRef} />
//       </div>
//       <MessageInput onSend={handleSendMessage} />
//     </>
//   );
// };

// export default ChatWindow;

// src/components/ChatWindow.js
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import MessageInput from "./MessageInput";
import MessageBubble from "./MessageBubble";
import socket from "../../socket";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ChatWindow = ({ conversation, setSelectedConversation, senderId, receiverId, user, serviceId }) => {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Connect the socket only once
    if (user) {
      socket.connect();
      socket.emit("join", user._id);
      console.log(`User ${user._id} connected for notifications`);

      // Handle incoming messages
      const handleReceiveMessage = (newMessage) => {
        if (newMessage.conversationId === conversation._id) {
          setMessages((prev) => [...prev, newMessage]);
        }
      };

      socket.on("receiveMessage", handleReceiveMessage);

      // Cleanup on component unmount
      return () => {
        socket.off("receiveMessage", handleReceiveMessage);
        socket.disconnect();
        console.log(`User ${user._id} disconnected`);
      };
    }
  }, [user, conversation]);

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

  // const handleSendMessage = async (text) => {
  //   if (!text.trim()) return;
  //   try {
  //     const res = await axios.post(`${BASE_URL}/api/messages`, {
  //       conversationId: conversation._id,
  //       sender: senderId,
  //       receiver: receiverId,
  //       content: text,
  //     });

  //     if (res.data.success) {
  //       const newMessage = res.data.data;
  //       setMessages((prev) => [...prev, newMessage]);
  //       socket.emit("sendMessage", newMessage);

  //       // Send notification
  //       const receiver = conversation.participants.find(p => p._id !== senderId)?._id;
  //       const notification = {
  //         recipientId: receiver,
  //         type: "message",
  //         message: `You have a new message from ${user.name}`,
  //         targetId: conversation._id,
  //         targetType: "message",
  //       };

  //       socket.emit("sendNotification", notification);
  //     }
  //   } catch (err) {
  //     console.error("Error sending message:", err);
  //   }
  // };


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
        const newMessage = res.data.data;
        setMessages((prev) => [...prev, newMessage]);
        
        // Emit real-time message to server
        socket.emit("sendMessage", newMessage);
  
        // Emit notification to receiver
        const receiver = conversation.participants.find(p => p._id !== senderId)?._id;
        const notification = {
          recipientId: receiver,
          type: "message",
          message: `You have a new message from ${user.name}`,
          targetId: serviceId,
          targetType: "message",
        };
  
        socket.emit("sendNotification", notification);
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

