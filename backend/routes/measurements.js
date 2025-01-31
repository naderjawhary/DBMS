import express from 'express';
import Athlete from '../models/Athlete.js'; // .js-Endung erforderlich!

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        // Alle Athleten abrufen
        const athletes = await Athlete.find();
        console.log("Fetched Athletes:", athletes); // Debugging

        // Alle Messwerte extrahieren
        const allMeasurements = athletes.flatMap((athlete) => athlete.measurements);
        console.log("Extracted Measurements:", allMeasurements); // Debugging

        // Einzigartige Messwerte basierend auf `id` und `name` filtern
        const uniqueMeasurements = Array.from(
            new Map(allMeasurements.map((m) => [m.id, m])).values()
        );

        const sortedMeasurements = uniqueMeasurements.sort((a, b) => a.id - b.id);

        res.json(sortedMeasurements); // Korrigierte Rückgabe mit sortierten Messwerten
    } catch (error) {
        console.error('Error fetching measurements:', error);
        res.status(500).json({ message: 'Error fetching measurements' });
    }
});

export default router;
