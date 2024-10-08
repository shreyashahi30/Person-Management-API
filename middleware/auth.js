// middleware/auth.js

const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    jwt.verify(token, jwtConfig.secret, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token.' });
        }
        req.user = user; // Attach user info to the request object
        next();
    });
};

module.exports = authenticateToken;

