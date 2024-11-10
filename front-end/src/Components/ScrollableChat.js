import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics"; // Ensure these functions are defined
import { ChatState } from "../Context/ChatProvider";
import "./styles/ScrollableChat.css"; // Import custom CSS

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
            <div className="chat-message" key={m._id}>
                {(isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id)) && (
                    <div className="avatar-container">
                        <img className="avatar" alt={m.sender.name} src={m.sender.pic} title={m.sender.name} />
                    </div>
                )}
                <span
                    className={`message-content ${
                        m.sender._id === user._id ? "sent" : "received"
                    }`}
                    style={{
                        marginLeft: isSameSenderMargin(messages, m, i, user._id),
                        marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                    }}
                    >
                    {m.content}
                </span>
            </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;