const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const allMessages = asyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
        .populate("sender", "name email")
        .populate("chat");
        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        return res.sendStatus(400);
    }

    const newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    };

    try {
        // Create the new message
        let message = await Message.create(newMessage);

        // Populate the sender, chat, and chat users fields
        message = await Message.findById(message._id)
            .populate("sender", "username pic") // Populate sender fields
            .populate({
                path: "chat",
                populate: {
                    path: "users", // Populate users within the chat
                    select: "username pic email",
                },
            });

        // Update latestMessage field in Chat document
        await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

        // Return the populated message as JSON
        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

module.exports = { allMessages, sendMessage };