// this not use i dvided the code into two parts to make it easier to read and understand. The first part contains the server setup, including the socket.io connection and notification handling. The second part contains the client-side code for the message box component, which handles user interactions and displays messages.


// import { useState, useRef, useEffect } from "react";
// import axios from "axios";
// import { Button, Card, Form, InputGroup, ListGroup, Badge } from "react-bootstrap";
// import { FiMessageSquare, FiSend } from "react-icons/fi";
// // import { io } from "socket.io-client";
// import "./Messages.css";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import socket from "../../socket";
// const MessageBox = ({ receiverId, serviceId }) => {
//   const [isVisible, setIsVisible] = useState(false);
//   const [conversations, setConversations] = useState([]);
//   const [selectedConversation, setSelectedConversation] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [onlineUsers, setOnlineUsers] = useState([]);
//   const messageBoxRef = useRef(null);
//   const messagesEndRef = useRef(null);
//   const { user } = useSelector((state) => state.auth);
//   const senderId = user ? user._id : null;
//   const navigate = useNavigate();
//   // const socket = useRef(null);

//   useEffect(() => {
//     if (senderId) {
//       socket.emit("join", senderId);
//     }
  
//     socket.on("onlineUsers", (users) => {
//       setOnlineUsers(users);
//     });
  
//     return () => {
//       socket.off("onlineUsers");
//     };
//   }, [senderId]);
  

  

//   const handleToggleVisibility = () => {
//     if (!senderId) {
//       navigate("/login");
//     } else {
//       setIsVisible(!isVisible);
//     }
//   };

//   useEffect(() => {
//     if (isVisible) {
//       fetchConversations();
//     }
//   }, [isVisible]);

//   useEffect(() => {
//     if (selectedConversation) {
//       fetchMessages(selectedConversation._id);
//     }
//   }, [selectedConversation]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (messageBoxRef.current && !messageBoxRef.current.contains(event.target)) {
//         setIsVisible(false);
//       }
//     };

//     if (isVisible) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isVisible]);

//   const fetchConversations = async () => {
//     try {
//       const response = await axios.get(`http://localhost:3000/api/conversations/sender/${senderId}/service/${serviceId}`);
//       if (response.data.success) {
//         setConversations(response.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching conversations:", error);
//     }
//   };

//   const fetchMessages = async (conversationId) => {
//     try {
//       const response = await axios.get(`http://localhost:3000/api/messages/conversation/${conversationId}`);
//       if (response.data.success) {
//         setMessages(response.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching messages:", error);
//     }
//   };

//   const createConversation = async () => {
//     try {
//       const response = await axios.post("http://localhost:3000/api/conversations", {
//         participants: [senderId, receiverId],
      
//         service: serviceId,
//       });

//       if (response.data.success) {
//         setConversations([...conversations, response.data.data]);
//         setSelectedConversation(response.data.data);
//       }
//     } catch (error) {
//       console.error("Error creating conversation:", error);
//     }
//   };

//   const sendMessage = async () => {
//     if (!newMessage.trim() || !selectedConversation) return;
  
//     try {
//       const response = await axios.post("http://localhost:3000/api/messages", {
//         conversationId: selectedConversation._id,
//         sender: senderId,
//         receiver: receiverId,
//         content: newMessage,
//       });
  
//       if (response.data.success) {
//         setMessages([...messages, response.data.data]);
//         setNewMessage("");
//         fetchMessages(selectedConversation._id);
  
//         // 🔔 Emit notification to receiver
//         console.log("Sending notification to receiver:", receiverId);
//         console.log("Sender:", senderId);
//         console.log("SendselectedConversationer:", selectedConversation.participants[0]._id);
//         console.log("Message content:", newMessage);
//         let receiver = selectedConversation.participants[0]._id === senderId ? selectedConversation.participants[1]._id : selectedConversation.participants[0]._id;
//         socket.emit("sendNotification", {
//           recipientId: receiver,
//           type: "promotion",
//           message: `You have a new message from ${user.name}`,
//         });
//       }
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };
  

//   return (
//     <div>
//       <Button
//         className="position-fixed bottom-0 end-0 m-3 rounded-circle d-flex align-items-center justify-content-center message-button"
//         variant="primary"
//         onClick={handleToggleVisibility}
//       >
//         <FiMessageSquare size={24} />
//       </Button>

//       {isVisible && (
//         <Card ref={messageBoxRef} className="position-fixed bottom-0 end-0 m-3 p-3 message-box">
//           <Card.Body>
//             {selectedConversation ? (
//               <>
//                 <Button variant="secondary" size="sm" onClick={() => setSelectedConversation(null)}>
//                   Back to Conversations
//                 </Button>
//                 <div className="message-list">
//                   {messages.length === 0 ? (
//                     <p className="text-muted text-center">No messages yet...</p>
//                   ) : (
//                     messages.map((msg, index) => (
//                       <div
//                         key={index}
//                         className={`message ${msg.sender._id === senderId ? "sent" : "received"}`}
//                       >
//                         <strong>{msg.sender._id === senderId ? "You" : msg.sender?.name || "Unknown"}:</strong> {msg.content}
//                       </div>
//                     ))
//                   )}
//                   <div ref={messagesEndRef} />
//                 </div>

//                 <InputGroup className="mt-2">
//                   <Form.Control
//                     type="text"
//                     placeholder="Type a message..."
//                     value={newMessage}
//                     onChange={(e) => setNewMessage(e.target.value)}
//                     onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//                   />
//                   <Button variant="primary" onClick={sendMessage}>
//                     <FiSend />
//                   </Button>
//                 </InputGroup>
//               </>
//             ) : (
//               <>
//                 <Card.Title className="text-center">Your Conversations</Card.Title>
//                 {conversations.length === 0 ? (
//                   <div className="text-center">
//                     <p className="text-muted">No conversations found.</p>
//                     <Button variant="primary" onClick={createConversation}>
//                       Start a Conversation
//                     </Button>
//                   </div>
//                 ) : (
//                   <ListGroup>
//                     {conversations.map((conv) => {
//                       const participant = conv.participants.find((p) => p._id !== senderId);
//                       return (
//                         <ListGroup.Item key={conv._id} action onClick={() => setSelectedConversation(conv)}>
//                           Chat with {participant?.name || "Unknown"}
//                           {console.log("Participant:", participant)}

//                           {onlineUsers.includes(participant?._id) && <Badge bg="success" className="ms-2">Online</Badge>}
//                         </ListGroup.Item>
//                       );
//                     })}
//                   </ListGroup>
//                 )}
//               </>
//             )}
//           </Card.Body>
//         </Card>
//       )}
//     </div>
//   );
// };

// export default MessageBox;