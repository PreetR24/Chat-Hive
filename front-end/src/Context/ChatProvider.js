import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [selectedChat, setSelectedChat] = useState(null); // Set to null for clarity
    const [chats, setChats] = useState([]); // Initialize to an empty array
    // const [notification, setNotification] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));

        if (userInfo) {
            setUser(userInfo);
        } else {
            navigate('/'); // Redirect if no user
        }
    }, [navigate]);

    return ( 
        <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats}}>
            {children}
        </ChatContext.Provider>
    );
};

export const ChatState = () => {
    return useContext(ChatContext);
};

export default ChatProvider;