const express = require('express');
const router = express.Router();
const {
    createTree,
    getAllTrees,
    getTreeById,
    updateTree,
    deleteTree
} = require('../controllers/treeController');

// Route: /api/trees
router.post('/', createTree);           // Create a new tree
router.get('/', getAllTrees);           // Get all trees
router.get('/:id', getTreeById);        // Get one tree by ID
router.put('/:id', updateTree);         // Update a tree
router.delete('/:id', deleteTree);      // Delete a tree

module.exports = router;