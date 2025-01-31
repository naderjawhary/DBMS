import mongoose from 'mongoose';

// Schema for individual nodes in the tree
const NodeSchema = new mongoose.Schema({
    measurement: {
        id: Number,
        name: String,
        unit: String
    },
    threshold: Number,
    isLeaf: { type: Boolean, default: false }, // Standardwert hinzugefügt
    intervention: { type: String, enum: ['Yes', 'No', ''], default: '' }, // Enum für sichere Werte
    children: {
        left: { type: mongoose.Schema.Types.Mixed, default: null }, // Falls kein Kind vorhanden ist, bleibt es null
        right: { type: mongoose.Schema.Types.Mixed, default: null }
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

export default mongoose.model('Tree', TreeSchema);
