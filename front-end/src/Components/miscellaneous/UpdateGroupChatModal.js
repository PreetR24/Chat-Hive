import axios from "axios";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";
import "./UpdateGroupChatModal.css"; // Import your CSS file

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain, onClose }) => {
const [groupChatName, setGroupChatName] = useState();
const [search, setSearch] = useState("");
const [searchResult, setSearchResult] = useState([]);
const [loading, setLoading] = useState(false);
const [renameloading, setRenameLoading] = useState(false);
const { selectedChat, setSelectedChat, user } = ChatState();

const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
    setSearchResult([]);
    return;
    }

    try {
    setLoading(true);
    const config = {
        headers: {
        Authorization: `Bearer ${user.token}`,
        },
    };
    const { data } = await axios.get(`/api/user?search=${search}`, config);
    setSearchResult(data);
    setLoading(false);
    } catch (error) {
    console.error("Failed to load search results", error);
    setLoading(false);
    }
};

const handleRename = async () => {
    if (!groupChatName) return;

    try {
    setRenameLoading(true);
    const config = {
        headers: {
        Authorization: `Bearer ${user.token}`,
        },
    };
    const { data } = await axios.put(
        `/api/chat/rename`,
        { chatId: selectedChat._id, chatName: groupChatName },
        config
    );

    setSelectedChat(data);
    setFetchAgain(!fetchAgain);
    setRenameLoading(false);
    } catch (error) {
    console.error("Failed to rename chat", error);
    setRenameLoading(false);
    }
    setGroupChatName("");
};

const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
    console.error("User already in group!");
    return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
    console.error("Only admins can add someone!");
    return;
    }

    try {
    setLoading(true);
    const config = {
        headers: {
        Authorization: `Bearer ${user.token}`,
        },
    };
    const { data } = await axios.put(
        `/api/chat/groupadd`,
        { chatId: selectedChat._id, userId: user1._id },
        config
    );

    setSelectedChat(data);
    setFetchAgain(!fetchAgain);
    setLoading(false);
    } catch (error) {
    console.error("Failed to add user", error);
    setLoading(false);
    }
};

const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
    console.error("Only admins can remove someone!");
    return;
    }

    try {
    setLoading(true);
    const config = {
        headers: {
        Authorization: `Bearer ${user.token}`,
        },
    };
    const { data } = await axios.put(
        `/api/chat/groupremove`,
        { chatId: selectedChat._id, userId: user1._id },
        config
    );

    user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
    setFetchAgain(!fetchAgain);
    fetchMessages();
    setLoading(false);
    } catch (error) {
    console.error("Failed to remove user", error);
    setLoading(false);
    }
};

return (
    <div className="modal">
    <div className="modal-header">
        {selectedChat.chatName}
        <button className="modal-close-button" onClick={onClose}>X</button>
    </div>

    <div className="user-badge-container">
        {selectedChat.users.map((u) => (
        <UserBadgeItem
            key={u._id}
            user={u}
            admin={selectedChat.groupAdmin}
            handleFunction={() => handleRemove(u)}
        />
        ))}
    </div>

    <div className="input-group">
        <input
        className="input"
        placeholder="Chat Name"
        value={groupChatName}
        onChange={(e) => setGroupChatName(e.target.value)}
        />
        <button
        className="button"
        onClick={handleRename}
        disabled={renameloading}
        >
        Update
        </button>
    </div>

    <div className="input-group">
        <input
        className="input"
        placeholder="Add User to group"
        onChange={(e) => handleSearch(e.target.value)}
        />
    </div>

    {loading ? (
        <div className="spinner">Loading...</div>
    ) : (
        searchResult.map((user) => (
        <UserListItem
            key={user._id}
            user={user}
            handleFunction={() => handleAddUser(user)}
        />
        ))
    )}

    <button className="footer-button" onClick={() => handleRemove(user)}>
        Leave Group
    </button>
    </div>
);
};

export default UpdateGroupChatModal;
