import express from 'express';
import Athlete from '../models/Athlete.js';

const router = express.Router();

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

// Route: Split-Logik für Messwerte
router.post('/split', async (req, res) => {
    const { measurementId, threshold, subset } = req.body;

    if (!measurementId || !threshold || !subset || !Array.isArray(subset) || subset.length === 0) {
        return res.status(400).json({ error: 'Missing or invalid parameters' });
    }

    try {
        const parsedMeasurementId = parseInt(measurementId);
        const parsedThreshold = parseFloat(threshold);

        if (isNaN(parsedMeasurementId) || isNaN(parsedThreshold)) {
            return res.status(400).json({ error: 'Invalid measurementId or threshold' });
        }

        // Finde die Athleten, die gefiltert werden
        const filteredAthletes = await Athlete.find({ _id: { $in: subset } });

        // Überprüfe, ob die Messwerte korrekt im Schema sind
        const leftCount = filteredAthletes.filter(athlete =>
            athlete.measurements.some(m => m.id === parsedMeasurementId && m.value <= parsedThreshold)
        ).length;

        const rightCount = filteredAthletes.filter(athlete =>
            athlete.measurements.some(m => m.id === parsedMeasurementId && m.value > parsedThreshold)
        ).length;

        res.json({ leftCount, rightCount });
    } catch (error) {
        console.error('Error processing split:', error);
        res.status(500).json({ error: 'Internal server error' });
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

export default router;
