const mongoose = require('mongoose');

// Schema für Athleten
const AthleteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    age: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true,
    },
    measurements: [
        {
            id: Number,
            name: String,
            value: Number,
            unit: String,
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Athlete', AthleteSchema);
