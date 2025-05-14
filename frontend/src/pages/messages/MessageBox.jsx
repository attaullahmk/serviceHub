import { useState, useRef, useEffect } from "react";
import { Button, Card } from "react-bootstrap";
import { FiMessageSquare } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import socket from "../../socket";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import "./Messages.css";

const MessageBox = ({ receiverId, serviceId }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const messageBoxRef = useRef(null);
  const { user } = useSelector((state) => state.auth);
  const senderId = user ? user._id : null;
  const navigate = useNavigate();

  const handleToggleVisibility = () => {
    if (!senderId) {
      navigate("/login");
    } else {
      setIsVisible(!isVisible);
    }
  };

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
            {selectedConversation ? (
              <ChatWindow
                conversation={selectedConversation}
                setSelectedConversation={setSelectedConversation}
                senderId={senderId}
                receiverId={receiverId}
                user={user}
                serviceId={serviceId}
              />
            ) : (
              <ConversationList
                senderId={senderId}
                receiverId={receiverId}
                serviceId={serviceId}
                setSelectedConversation={setSelectedConversation}
              />
            )}
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default MessageBox;
