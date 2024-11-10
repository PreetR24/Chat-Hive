import "./UserBadgeItem.css";

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <div className="user-badge" onClick={handleFunction}>
      {user.username}
      {admin === user._id && <span className="admin-badge"> (Admin)</span>}
      <span className="close-icon">&times;</span>
    </div>
  );
};

export default UserBadgeItem;