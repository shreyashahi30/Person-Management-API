// config/jwtConfig.js

const jwtConfig = {
    secret: process.env.JWT_SECRET || '3f55c8e8c5eb4d5c8e8bc50c4f6e4732a4e14f3cfb5a40c10f6e18f2b3c16b7a', 
    expiresIn: '1h', // Token expiration time
};

module.exports = jwtConfig;

