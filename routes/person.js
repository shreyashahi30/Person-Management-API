// routes/person.js

const express = require('express');
const router = express.Router();
const Person = require('../models/person');
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth');

// Middleware to protect person routes
router.use(authMiddleware);

// Get all persons with pagination and sorting
router.get('/', async (req, res) => {
    const { page = 1, limit = 10, sortBy = 'name', order = 'asc' } = req.query;

    try {
        const persons = await Person.find({ deleted: false })
            .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));
        
        const total = await Person.countDocuments({ deleted: false });
        res.status(200).json({ total, page: Number(page), persons });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch persons!' });
    }
});

// Create a new person
router.post(
    '/',
    [
        body('name').notEmpty().withMessage('Name is required.'),
        body('age').isInt({ min: 0 }).withMessage('Age must be a positive integer.'),
        body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Gender must be Male, Female, or Other.'),
        body('mobileNumber').matches(/^\d{10}$/).withMessage('Mobile number must be a 10-digit number.'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, age, gender, mobileNumber, address } = req.body;
        try {
            const person = new Person({ name, age, gender, mobileNumber, address, deleted: false });
            await person.save();
            res.status(201).json({ message: 'Person created successfully!' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to create person!' });
        }
    }
);

// Update a person
router.put('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const person = await Person.findOneAndUpdate({ _id: id, deleted: false }, req.body, { new: true, runValidators: true });
        if (!person) {
            return res.status(404).json({ message: 'Person not found!' });
        }
        res.status(200).json({ message: 'Person updated successfully!', person });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update person!' });
    }
});

// Soft delete a person
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const person = await Person.findOneAndUpdate({ _id: id, deleted: false }, { deleted: true }, { new: true });
        if (!person) {
            return res.status(404).json({ message: 'Person not found!' });
        }
        res.status(200).json({ message: 'Person deleted successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete person!' });
    }
});

module.exports = router;

