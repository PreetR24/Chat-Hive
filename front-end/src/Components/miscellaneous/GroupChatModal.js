import { useState } from "react";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";
import "./GroupChatModal.css";

const GroupChatModal = ({ children }) => {
    const [groupChatName, setGroupChatName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user, chats, setChats } = ChatState();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
        alert("User already added");
        return;
        }
        setSelectedUsers([...selectedUsers, userToAdd]);
    };

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) return;

        try {
            setLoading(true);
            const config = {
                headers: {
                Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`/api/user?search=${search}`, config);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            alert("Failed to load the search results");
        }
    };

    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
    };

    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers.length) {
        alert("Please fill all fields");
        return;
        }

        try {
        const config = {
            headers: {
            Authorization: `Bearer ${user.token}`,
            },
        };
        const { data } = await axios.post(
            `/api/chat/group`,
            { name: groupChatName, users: JSON.stringify(selectedUsers.map((u) => u._id)) },
            config
        );
        setChats([data, ...chats]);
        setIsModalOpen(false);
        alert("New Group Chat Created!");
        } catch (error) {
        alert("Failed to Create the Chat!");
        }
    };

    return (
        <>
        <span onClick={() => setIsModalOpen(true)}>{children}</span>

        {isModalOpen && (
            <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                <h2>Create Group Chat</h2>
                <span onClick={() => setIsModalOpen(false)} className="modal-close">
                    &times;
                </span>
                </div>
                <div className="modal-body">
                <input
                    type="text"
                    placeholder="Chat Name"
                    onChange={(e) => setGroupChatName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Add Users e.g., John, Piyush, Jane"
                    onChange={(e) => handleSearch(e.target.value)}
                />
                <div className="selected-users">
                    {selectedUsers.map((u) => (
                        <UserBadgeItem key={u._id} user={u} handleFunction={() => handleDelete(u)} />
                    ))}
                </div>
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    searchResult?.slice(0, 4).map((user) => (
                        <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
                    ))
                )}
                </div>
                <div className="modal-footer">
                    <button onClick={handleSubmit}>Create Chat</button>
                </div>
            </div>
            </div>
        )}
        </>
    );
};

export default GroupChatModal;