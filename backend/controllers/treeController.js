import Tree from '../models/Tree.js'; // `.js` ist notwendig in ES Modules!

// Create new tree
export const createTree = async (req, res) => {
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
export const getAllTrees = async (req, res) => {
    try {
        const trees = await Tree.find();
        res.json(trees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single tree by ID
export const getTreeById = async (req, res) => {
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
export const updateTree = async (req, res) => {
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
export const deleteTree = async (req, res) => {
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
