const express = require('express');
const router = express.Router();
const Athlete = require('../models/Athlete');

// Route: Alle einzigartigen Messwerte aus Athleten extrahieren
router.get('/', async (req, res) => {
    try {
        // Alle Athleten abrufen
        const athletes = await Athlete.find();

        // Alle Messwerte extrahieren
        const allMeasurements = athletes.flatMap((athlete) => athlete.measurements);

        // Einzigartige Messwerte basierend auf `id` und `name` filtern
        const uniqueMeasurements = Array.from(
            new Map(allMeasurements.map((m) => [m.id, m])).values()
        );

        res.json(uniqueMeasurements);
    } catch (error) {
        console.error('Error fetching measurements:', error);
        res.status(500).json({ message: 'Error fetching measurements' });
    }
});

module.exports = router;
