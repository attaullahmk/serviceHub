const MessageBubble = ({ message, senderId }) => {
    const isSent = message.sender._id === senderId;
  
    return (
      <div className={`message ${isSent ? "sent" : "received"}`}>
        <strong>{isSent ? "You" : message.sender?.name || "Unknown"}:</strong> {message.content}
      </div>
    );
  };
  
  export default MessageBubble;
  