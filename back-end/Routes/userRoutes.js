const express = require("express");
const multer = require("multer");
const { regiterUser, authUser, allUsers } = require("../controllers/userControllers");
const router = express.Router();
const {protect} = require("../middlewares/authMiddleware");
const storage = multer.memoryStorage(); // Change storage as needed
const upload = multer({ storage });

// Use upload.single('pic') to handle the file upload in registration
router.route('/').post(upload.single('pic'), regiterUser).get(protect,allUsers);
router.post('/login', authUser);

module.exports = router;