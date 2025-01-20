const express = require('express');
const router = express.Router();
const Athlete = require('../models/Athlete');

// Route: Alle Athleten abrufen
router.get('/', async (req, res) => {
    try {
        const athletes = await Athlete.find();
        res.json(athletes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route: Athlet erstellen
router.post('/', async (req, res) => {
    try {
        const athlete = new Athlete(req.body);
        const savedAthlete = await athlete.save();
        res.status(201).json(savedAthlete);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route: Athlet nach ID abrufen
router.get('/:id', async (req, res) => {
    try {
        const athlete = await Athlete.findById(req.params.id);
        if (!athlete) return res.status(404).json({ message: 'Athlete not found' });
        res.json(athlete);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route: Athlet aktualisieren
router.put('/:id', async (req, res) => {
    try {
        const updatedAthlete = await Athlete.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedAthlete) return res.status(404).json({ message: 'Athlete not found' });
        res.json(updatedAthlete);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route: Athlet löschen
router.delete('/:id', async (req, res) => {
    try {
        const deletedAthlete = await Athlete.findByIdAndDelete(req.params.id);
        if (!deletedAthlete) return res.status(404).json({ message: 'Athlete not found' });
        res.json({ message: 'Athlete deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
