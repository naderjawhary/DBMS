const mongoose = require('mongoose');

// Schema for individual nodes in the tree
const NodeSchema = new mongoose.Schema({
    measurement: {
        id: Number,
        name: String,
        unit: String
    },
    threshold: Number,
    children: {
        left: { type: mongoose.Schema.Types.Mixed }, // Will contain another node
        right: { type: mongoose.Schema.Types.Mixed } // Will contain another node
    }
});

// Main tree schema
const TreeSchema = new mongoose.Schema({
    rootNode: NodeSchema,
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastModified: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Tree', TreeSchema);