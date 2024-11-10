import { useEffect, useState } from "react";
import axios from "axios";
import { getSender } from "../config/ChatLogics";
// import { getSender, getSenderFull } from "../config/ChatLogics";
import io from "socket.io-client";
import { ChatState } from "../Context/ChatProvider";
import ScrollableChat from "./ScrollableChat";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import "./styles/SingleChat.css"; // Include your CSS file
import { FaEye } from "react-icons/fa";
import Lottie from "react-lottie";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] =    useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const {selectedChat, setSelectedChat, user, notification, setNotification } = ChatState();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => setIsModalOpen(!isModalOpen);

    const defaultOptions = {
        loop: true,
        autoplay: true,
        // animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
    };

    const fetchMessages = async () => {
            if (!selectedChat) return;

            try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            setLoading(true);

            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
            setMessages(data);
            setLoading(false);

            socket.emit("join chat", selectedChat._id);
        } catch (error) {
            console.log(error)
        alert("Error Occurred! Failed to Load the Messages");
        }
    };
    
    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
    }, []);

    useEffect(() => {
        fetchMessages();

        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
        socket.emit("stop typing", selectedChat._id);
        try {
            const config = {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${user.token}`,
            },
            };
            setNewMessage("");
            const { data } = await axios.post(
            "/api/message",
            {
                content: newMessage,
                chatId: selectedChat._id,
            },
            config
            );
            socket.emit("new message", data);
            setMessages([...messages, data]);
        } catch (error) {
            console.log(error)
            alert("Error Occurred! Failed to send the Message");
        }
        }
    };

    useEffect(() => {
        socket.on("message received", (newMessageReceived) => {
        if (
            !selectedChatCompare ||
            selectedChatCompare._id !== newMessageReceived.chat._id
        ) {
            if (!notification.includes(newMessageReceived)) {
            setNotification([newMessageReceived, ...notification]);
            setFetchAgain(!fetchAgain);
            }
        } else {
            setMessages([...messages, newMessageReceived]);
        }
        });
    });

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };

    return (
        <div className="single-chat">
        {selectedChat ? (
            <>
            <div className="chat-header">
                <button className="back-button" onClick={() => setSelectedChat("")}>
                Back
                </button>
                {messages && (!selectedChat.isGroupChat ? (
                <>
                    <span className="username">{getSender(user, selectedChat.users)}</span>
                    {/* <ProfileModel user={getSenderFull(user, selectedChat.users)} /> */}
                </>
                ) : (
                <>
                    <span>{selectedChat.chatName.toUpperCase()}</span>
                    <button className="eye-button" onClick={toggleModal}>
                    <FaEye /> {/* Eye icon button */}
                  </button>
                  {isModalOpen && (
                    <UpdateGroupChatModal
                        fetchMessages={fetchMessages}
                        fetchAgain={fetchAgain}
                        setFetchAgain={setFetchAgain}
                        onClose={toggleModal} // Optional close handler if needed
                    />
                  )}
                </>
                ))}
            </div>
            <div className="messages-container">
                {loading ? (
                <div className="loading-spinner">Loading...</div>
                ) : (
                <ScrollableChat messages={messages} />
                )}
                <div className="input-container">
                {isTyping && <div><Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>}
                <input
                    type="text"
                    className="message-input"
                    placeholder="Enter a message..."
                    value={newMessage}
                    onChange={typingHandler}
                    onKeyDown={sendMessage}
                />
                </div>
            </div>
            </>
        ) : (
            <div className="no-chat-message">
            <h3>Click on a user to start chatting</h3>
            </div>
        )}
        </div>
    );
};

export default SingleChat;