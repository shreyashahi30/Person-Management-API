// routes/auth.js

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const jwtConfig = require('../config/jwtConfig');
const nodemailer = require('nodemailer');

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Use your email service
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email password or app password
    },
});

// Registration route
router.post(
    '/register',
    [
        body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long.'),
        body('email').isEmail().withMessage('Invalid email format.'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const user = new User({ username, email, password: hashedPassword, role: 'user', isVerified: false });
            await user.save();

            // Send verification email
            const verificationToken = jwt.sign({ id: user._id }, jwtConfig.secretKey, { expiresIn: '1h' });
            const verificationUrl = `http://localhost:3000/auth/verify-email?token=${verificationToken}`;

            await transporter.sendMail({
                to: email,
                subject: 'Email Verification',
                text: `Please verify your email by clicking this link: ${verificationUrl}`,
            });

            res.status(201).json({ message: 'User registered successfully! Check your email for verification.' });
        } catch (error) {
            res.status(500).json({ error: 'User registration failed!' });
        }
    }
);

// Email verification route
router.get('/verify-email', async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ message: 'Token is required!' });
    }

    try {
        const decoded = jwt.verify(token, jwtConfig.secretKey);
        await User.findByIdAndUpdate(decoded.id, { isVerified: true });
        res.status(200).json({ message: 'Email verified successfully!' });
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token!' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !user.isVerified || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid email or password!' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, jwtConfig.secretKey, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed!' });
    }
});

// Get user profile
router.get('/profile', async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token is required!' });
    }

    try {
        const decoded = jwt.verify(token, jwtConfig.secretKey);
        const user = await User.findById(decoded.id).select('-password'); // Exclude password from response
        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(401).json({ message: 'Invalid token!' });
    }
});

// Admin route to get all users
router.get('/admin/users', async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token is required!' });
    }

    try {
        const decoded = jwt.verify(token, jwtConfig.secretKey);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied!' });
        }

        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(401).json({ message: 'Invalid token!' });
    }
});

module.exports = router;

