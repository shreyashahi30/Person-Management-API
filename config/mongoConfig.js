// config/mongoConfig.js

const mongoConfig = {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/person-management', 
};

module.exports = mongoConfig;

