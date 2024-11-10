const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./Routes/userRoutes")
const chatRoutes = require("./Routes/chatRoutes")
const messageRoutes = require("./routes/messageRoutes");
const {notFound, errorHandler}= require("./middlewares/errorMiddleware")
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require('body-parser');

// const path = require("path");

dotenv.config();
connectDB();
const app = express();

app.use(cors());
app.use(express.json());

app.use(bodyParser.json({ limit: '10mb' })); // Increase limit to 10MB or as needed
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.get("/", async(req, res) => {
    res.send("Api")
});

app.use('/api/user',userRoutes);
app.use('/api/chat', chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000;
const server = app.listen( PORT,
    console.log(`Server running on PORT ${PORT}...`.yellow)
);

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
        // credentials: true,
    },
});

io.on("connection", (socket) => {
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });
  
    socket.on("join chat", (room) => {
        socket.join(room);
    });
    
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  
    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;
    
        if (!chat.users) return console.log("chat.users not defined");
    
        chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id) return;
    
            socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
    });
    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});