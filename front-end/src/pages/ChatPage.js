import React from "react";
import { ChatState } from "../Context/ChatProvider";
import SideDrawer from "../Components/SideDrawer";
import ChatBox from "../Components/ChatBox";
import MyChats from "../Components/MyChats";

const ChatPage = () =>{
    const { user } = ChatState();

    return (
        <div style={{ width: "100%" }}>
            { user && <SideDrawer/> }
            <div style={{display:"flex", justifyContent:"space-between", width:"100%", height:"91.5vh", padding:"10px"}}>
                { user && <MyChats/> }
                { user && <ChatBox/> }
            </div>
        </div>
    );
}

export default ChatPage;