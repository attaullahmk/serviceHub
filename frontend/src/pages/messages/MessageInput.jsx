import { useState } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import { FiSend } from "react-icons/fi";

const MessageInput = ({ onSend }) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    onSend(newMessage);
    setNewMessage("");
  };

  return (
    <InputGroup className="mt-2">
      <Form.Control
        type="text"
        placeholder="Type a message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <Button variant="primary" onClick={handleSend}>
        <FiSend />
      </Button>
    </InputGroup>
  );
};

export default MessageInput;
