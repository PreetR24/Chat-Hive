import React, {useState} from "react";
import { ChatState } from "../Context/ChatProvider";
import SideDrawer from "../Components/SideDrawer";
import Chatbox from "../Components/ChatBox";
import MyChats from "../Components/MyChats";

const ChatPage = () =>{
    const { user } = ChatState();
    const [fetchAgain, setFetchAgain] = useState(false);

    return (
        <div style={{ width: "100%" }}>
            { user && <SideDrawer/> }
            <div style={{display:"flex", justifyContent:"space-between", width:"100%", height:"91.5vh", padding:"10px"}}>
                {user && <MyChats fetchAgain={fetchAgain} />}
                {user && (
                    <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                )}
            </div>
        </div>
    );
}

export default ChatPage;