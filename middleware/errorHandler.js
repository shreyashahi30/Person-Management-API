// middleware/errorHandler.js

const fs = require('fs');
const path = require('path');

// Function to log errors to a file
const logError = (error) => {
    const logPath = path.join(__dirname, '../logs/error.log');
    const errorMsg = `[${new Date().toISOString()}] ${error}\n`;
    fs.appendFile(logPath, errorMsg, (err) => {
        if (err) console.error('Failed to log error:', err);
    });
};

// Middleware to handle errors
const errorHandler = (err, req, res, next) => {
    logError(err.stack); // Log the error stack for debugging

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        error: {
            message: err.message || 'An unexpected error occurred',
            stack: process.env.NODE_ENV === 'production' ? null : err.stack, 
        },
    });
};

module.exports = errorHandler;

