import "./styles/ChatBox.css";
import SingleChat from "./SingleChat";
import { ChatState } from "../Context/ChatProvider";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
    const { selectedChat } = ChatState();
  
    return (
      <div className="chatbox-container">
        {selectedChat ? (
            <div className="single-chat-container visible">
                <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
            </div>
        ) : (
            <div className="empty-chat">
                Select a chat to start messaging
            </div>
        )}
      </div>
    );
};
  
export default Chatbox;