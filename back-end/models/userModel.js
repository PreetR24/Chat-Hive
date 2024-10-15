const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        username: { type: String, required: true },  // Username field
        email: { type: String, required: true, unique: true },  // Email field
        password: {
            type: String,
            required: true,
            minlength: 8,  // Minimum length of 8 characters
            match: [
                /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                "Password must be at least 8 characters containing letters and alphabets",
            ],  // Regex for password validation
        },
        pic: {
            type: Buffer,
        },
    },
    {
        timestamps: true,  // Automatically add createdAt and updatedAt timestamps
    }
);

// Method to compare the entered password with the hashed password in the database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Pre-save middleware to hash the password before saving it
userSchema.pre('save', async function (next) {
  // Only hash the password if it is modified (or new)
    if (!this.isModified('password')) {
        next();
    }

    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next(); // Call next middleware
});

const User = mongoose.model("User", userSchema);

module.exports = User;