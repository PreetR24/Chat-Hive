const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./Routes/userRoutes")
const chatRoutes = require("./Routes/chatRoutes")
const {notFound, errorHandler}= require("./middlewares/errorMiddleware")
const cors = require("cors");

connectDB();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", async(req, res) => {
    res.send("Api")
});

app.use('/api/user',userRoutes);
app.use('/api/chat', chatRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});