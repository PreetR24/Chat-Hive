const jwt = require('jsonwebtoken');
const User = require("../models/userModel");
const AsyncHandler = require("express-async-handler");

const protect = AsyncHandler(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(" ")[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user to request
            req.user = await User.findById(decoded.id).select("-password");

            if (!req.user) {
                res.status(401);
                throw new Error("Not authorized, user not found");
            }

            next();
        } catch (error) {
            console.error("Token verification error:", error); // Debugging log
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    }

    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
});

module.exports = { protect };