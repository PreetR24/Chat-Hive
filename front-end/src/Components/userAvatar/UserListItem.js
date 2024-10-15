import React from "react";
import "./UserListItem.css"; // Import the CSS file for styling

const UserListItem = ({ user, handleFunction }) => {
  const imageSrc = user.pic ? `data:image/png;base64,${user.pic}` : null;
  return (
    <div className="user-list-item" onClick={handleFunction}>
      <img src={imageSrc} alt="User Avatar"/>
      <div className="user-details">
        <span className="user-name">{user.username}</span>
        {/* <span className="user-email"><b>Email: </b>{user.email}</span> */}
      </div>
    </div>
  );
};

export default UserListItem;