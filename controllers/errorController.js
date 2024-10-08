// controllers/errorController.js

const fs = require('fs');
const path = require('path');

const logError = (error) => {
    const logPath = path.join(__dirname, '../logs/error.log');
    const errorMsg = `[${new Date().toISOString()}] ${error}\n`;
    fs.appendFile(logPath, errorMsg, (err) => {
        if (err) console.error('Failed to log error:', err);
    });
};

exports.handleNotFound = (req, res) => {
    res.status(404).json({ error: 'Not Found', message: 'The requested resource could not be found' });
};

exports.handleServerError = (err, req, res, next) => {
    logError(err.stack); // Log the error stack for debugging
    res.status(500).json({ error: 'Internal Server Error', message: 'An unexpected error occurred' });
};

