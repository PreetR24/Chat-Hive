import React from "react";
import "./styles/ChatLoading.css"; // Import the CSS file for styling

const ChatLoading = () => {
  return (
    <div className="loading-container">
      {[...Array(12)].map((_, index) => (
        <div key={index} className="skeleton"></div>
      ))}
    </div>
  );
};

export default ChatLoading;