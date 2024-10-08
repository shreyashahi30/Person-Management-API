// models/person.js

const mongoose = require('mongoose');

// Address sub-document schema
const addressSchema = new mongoose.Schema({
    street: {
        type: String,
        required: true,
        trim: true,
    },
    city: {
        type: String,
        required: true,
        trim: true,
    },
    state: {
        type: String,
        required: true,
        trim: true,
    },
    zipCode: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^\d{5}(?:[-\s]\d{4})?$/.test(v); 
            },
            message: props => `${props.value} is not a valid zip code!`,
        },
    },
});

// Define the Person schema with an address field
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    age: {
        type: Number,
        required: true,
        min: [0, 'Age must be positive'],
        max: [120, 'Age must be less than 120'],
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other'], 
    },
    mobileNumber: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v); 
            },
            message: props => `${props.value} is not a valid mobile number!`,
        },
    },
    address: addressSchema, 
}, { timestamps: true }); 

personSchema.methods.getProfile = function () {
    return {
        id: this._id,
        name: this.name,
        age: this.age,
        gender: this.gender,
        mobileNumber: this.mobileNumber,
        address: this.address,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
    };
};


personSchema.statics.findByAgeRange = async function (minAge, maxAge) {
    return await this.find({ age: { $gte: minAge, $lte: maxAge } });
};


const Person = mongoose.model('Person', personSchema);

module.exports = Person;

