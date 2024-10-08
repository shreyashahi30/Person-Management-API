// controllers/personController.js

const Person = require('../models/person');
const { validationResult } = require('express-validator');

// Get all persons
exports.getAllPersons = async (req, res) => {
    try {
        const persons = await Person.find();
        res.status(200).json(persons);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching persons', details: error.message });
    }
};

// Create a new person
exports.createPerson = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, age, gender, mobile } = req.body;
    const newPerson = new Person({ name, age, gender, mobile });

    try {
        await newPerson.save();
        res.status(201).json({ message: 'Person created successfully', person: newPerson });
    } catch (error) {
        res.status(500).json({ error: 'Error creating person', details: error.message });
    }
};

// Update a person by ID
exports.updatePerson = async (req, res) => {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, age, gender, mobile } = req.body;

    try {
        const updatedPerson = await Person.findByIdAndUpdate(id, { name, age, gender, mobile }, { new: true });
        if (!updatedPerson) {
            return res.status(404).json({ error: 'Person not found' });
        }
        res.status(200).json({ message: 'Person updated successfully', person: updatedPerson });
    } catch (error) {
        res.status(500).json({ error: 'Error updating person', details: error.message });
    }
};

// Delete a person by ID
exports.deletePerson = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedPerson = await Person.findByIdAndDelete(id);
        if (!deletedPerson) {
            return res.status(404).json({ error: 'Person not found' });
        }
        res.status(200).json({ message: 'Person deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting person', details: error.message });
    }
};

