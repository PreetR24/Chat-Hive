import React, { useState, useEffect } from "react";
import axios from 'axios';
import { ChatState } from "../Context/ChatProvider";
import ChatLoading from "./ChatLoading";
import UserListItem from "./userAvatar/UserListItem";
import "./styles/sideDrawer.css";
import { useNavigate } from "react-router-dom";
import ProfileModel from "./miscellaneous/ProfileModel";

function SideDrawer() {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const navigate = useNavigate();
    
    const {
        setSelectedChat,
        user,
        chats,
        setChats,
    } = ChatState();

    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css';
        document.head.appendChild(link);
    
        return () => {
          document.head.removeChild(link); // Cleanup when component unmounts
        };
    }, []);

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        navigate('/');
    };

    const handleSearch = async () => {
        if (!search) {
            alert("Please Enter something in search");
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

            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            alert("Error Occurred! Failed to Load the Search Results");
        }
    };

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);
            const config = {
                headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(`/api/chat`, { userId }, config);
            if (!chats.find((c)=>c._id===data._id)) setChats([data, ...chats]);

            setSelectedChat(data);
            setLoadingChat(false);
            setDrawerVisible(false);  // Close drawer after accessing chat
        } catch (error) {
            alert("Error fetching the chat");
        }
    };

    const clearSearch = () => {
        setSearch("");
        setSearchResult([]);
    };

    return (
        <>
        <div className="sideDrawer">
            <button className="searchBtn" onClick={() => setDrawerVisible(true)}>
                <i className="fas fa-search"></i>
                <span style={{ paddingLeft: "10px" }}>Search User</span>
            </button>
            <h1 style={{ fontSize: "24px", fontFamily: "Arial, sans-serif" }}>Chat Hive</h1>
            <div>
                <span className="notification">
                    {/* {notification.length > 0 ? New Messages (${notification.length}) : "No New Messages"} */}
                </span>
                <div style={{ display: "flex", gap: "20px" }}>
                    <ProfileModel user={user}>
                        <button className="image-button"><i className="bx bx-user" /></button>
                    </ProfileModel>
                    <button className="image-button" onClick={logoutHandler}><i className="bx bx-log-out" /></button>
                </div>
            </div>
        </div>

        <div className={`drawer ${drawerVisible ? 'open' : ''}`}>
            <div className="drawer-header">
                <h2>Search Users</h2>
                <button onClick={() => setDrawerVisible(false)} className="closeBtn">
                    &times;
                </button>
            </div>
            <div className="drawer-content">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                        type="text" placeholder="Search by name" value={search} onChange={(e) => setSearch(e.target.value)}
                        style={{ flex: 1 }}
                    />
                    {search && (
                        <button className="clearBtn" onClick={clearSearch} style={{ marginLeft: '10px', padding: '10px' }}>
                            Clear
                        </button>
                    )}
                </div>
                <button className="searchGoBtn" onClick={handleSearch}>Go</button>
            </div>
            <div className="drawer-content">
                {loading ? (
                    <ChatLoading />
                ) : (
                    searchResult?.map((user) => (
                    <UserListItem key={user._id} user={user} handleFunction={() => accessChat(user._id)} />
                    ))
                )}
                {loadingChat && <div className="spinner">Loading...</div>}
            </div>
        </div>
        </>
    );
}

export default SideDrawer;