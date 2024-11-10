import { useEffect, useState } from "react";
import axios from "axios";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { ChatState } from "../Context/ChatProvider";
import "./styles/MyChats.css";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get("/api/chat", config);
            setChats(data);
        } catch (error) {
            alert("Failed to Load the chats");
        }
    };

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats();
    }, [fetchAgain]);

    return (
        <div className={`my-chats`}>
        <div className="header">
            <h2>My Chats</h2>
            <GroupChatModal>
                <button className="new-group-chat">New Group Chat</button>
            </GroupChatModal>
        </div>
        <div className="my-chats-list">
            {chats ? (
            chats.map((chat) => (
                <div 
                key={chat._id} 
                className={`chat-item ${selectedChat === chat ? 'active-chat' : ''}`} 
                onClick={() => setSelectedChat(chat)}
                >
                <div className="chat-name">
                    {/* {!chat.isGroupChat && chat.users[1]?.pic ? (
                    <img
                        src={`data:image/png;base64,${chat.users[1].pic}`}
                        className="user-avatar" // Add class for styling if needed
                    />
                    ) : null} */}
                    {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                </div>
                {chat.latestMessage && (
                    <div className="chat-latest-message">
                        <strong>{chat.latestMessage.sender.name} :</strong>{" "}
                        {chat.latestMessage.content.length > 50
                            ? chat.latestMessage.content.substring(0, 51) + "..."
                            : chat.latestMessage.content}
                    </div>
                )}
                </div>
            ))
            ) : (
            <ChatLoading />
            )}
        </div>
        </div>
    );
};

export default MyChats;