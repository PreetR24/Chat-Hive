import React, {useState, useEffect} from 'react';
import { ChatState } from '../Context/ChatProvider';
import axios from 'axios';
import ChatLoading from './ChatLoading';
import "./styles/MyChats.css"
import {getSender} from "../config/ChatLogics"

const MyChats= ()=> {
    const [loggedUser, setloggedUser] = useState();
    const {selectedChats, setSelectedChats, user, chats, setChats} = ChatState();

    const fetchChats = async () =>{
        try {
            const config = {
                headers: {
                    "Authorization": `Bearer ${user.token}}`,
                },
            }

            const {data} = await axios.get("http://localhost:5000/api/chat", config);
            console.log(data);
            setChats(data);
        } catch (error) {
            // throw new Error("Failed to load the Chats")
        }
    }

    useEffect(() => {
        setloggedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats();
    }, [])
    
    return(
        <div className="my-chats-container">
            <div className="my-chats-header">
                My Chats
                <button className="new-group-chat-btn">
                New Group Chat
                </button>
            </div>
            <div className="my-chats-list">
                {chats ? (
                chats.map((chat) => (
                    <div key={chat._id} className={`chat-item ${selectedChats === chat ? 'active-chat' : ''}`} onClick={() => setSelectedChats(chat)} >
                        <div className="chat-name">
                        {chat.users[1]?.pic ? (
            <img
              src={`data:image/png;base64,${chat.users[1].pic}`}
              alt="User Avatar"
            />
          ) : null}
                            {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName} 
                        </div>
                        {chat.latestMessage && (
                            <div className="chat-latest-message">
                                <b>{chat.latestMessage.sender.name} : </b>
                                {chat.latestMessage.content.length > 50
                                    ? chat.latestMessage.content.substring(0, 51) + '...'
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
    )
}

export default MyChats;