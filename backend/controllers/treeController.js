const Tree = require('../models/Tree');

// Create new tree
const createTree = async (req, res) => {
    try {
        const newTree = await Tree.create({
            rootNode: req.body.rootNode
        });
        res.status(201).json(newTree);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all trees
const getAllTrees = async (req, res) => {
    try {
        const trees = await Tree.find();
        res.json(trees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single tree by ID
const getTreeById = async (req, res) => {
    try {
        const tree = await Tree.findById(req.params.id);
        if (!tree) {
            return res.status(404).json({ message: 'Tree not found' });
        }
        res.json(tree);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a tree
const updateTree = async (req, res) => {
    try {
        const updatedTree = await Tree.findByIdAndUpdate(
            req.params.id,
            {
                rootNode: req.body.rootNode,
                lastModified: Date.now()
            },
            { new: true } // Returns the updated document
        );
        if (!updatedTree) {
            return res.status(404).json({ message: 'Tree not found' });
        }
        res.json(updatedTree);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a tree
const deleteTree = async (req, res) => {
    try {
        const tree = await Tree.findByIdAndDelete(req.params.id);
        if (!tree) {
            return res.status(404).json({ message: 'Tree not found' });
        }
        res.json({ message: 'Tree deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createTree,
    getAllTrees,
    getTreeById,
    updateTree,
    deleteTree
};