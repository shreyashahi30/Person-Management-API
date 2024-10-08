// config/db.js

const mongoose = require('mongoose');
const mongoConfig = require('./mongoConfig');

const connectDB = async () => {
    try {
        await mongoose.connect(mongoConfig.uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;

