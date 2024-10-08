// models/user.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the User schema with role and profile picture
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 20,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(v); // Validates email format
            },
            message: props => `${props.value} is not a valid email address!`,
        },
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Define roles
        default: 'user',
    },
    profilePicture: {
        type: String,
        validate: {
            validator: function (v) {
                return /^(http|https):\/\/[^ "]+$/.test(v); // Validates URL format for profile picture
            },
            message: props => `${props.value} is not a valid URL!`,
        },
    },
}, { timestamps: true });

// Pre-save hook to hash password before saving to database
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Method to check if entered password matches stored password
userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Static method to find users by role
userSchema.statics.findByRole = async function (role) {
    return await this.find({ role });
};

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;

