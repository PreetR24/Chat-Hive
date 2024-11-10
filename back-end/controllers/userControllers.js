const AsyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

const regiterUser = AsyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400);
        throw new Error("Please fill in all fields backend");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create({
        username, email, password, pic: req.file ? req.file.buffer : null,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            pic: user.pic ? user.pic.toString('base64') : null,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error("Failed to create the user");
    }
});

const authUser = AsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
  
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            pic: user.pic ? user.pic.toString('base64') : null,
            token: generateToken(user._id),
        });
    } else {
      res.status(400);
      throw new Error("Invalid email or password");
    }
});  

const allUsers = AsyncHandler(async (req, res) => {
    const keyword= req.query.search
    ? {
        $or: [
            { username: { $regex: req.query.search, $options: "i"}}
        ],
    }
    : {};

    const users= await User.find(keyword).find({_id:{ $ne: req.user._id}});
    const formattedUsers = users.map(user => ({
        ...user._doc,
        pic: user.pic ? user.pic.toString('base64') : null
    }));
    res.send(formattedUsers);
});

module.exports = {regiterUser, authUser, allUsers};