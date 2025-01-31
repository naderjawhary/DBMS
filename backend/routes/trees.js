import express from 'express';
import {
    createTree,
    getAllTrees,
    getTreeById,
    updateTree,
    deleteTree
} from '../controllers/treeController.js'; // `.js` ist notwendig in ES Modules!

const router = express.Router();

// Route: /api/trees
router.post('/', createTree);           // Create a new tree
router.get('/', getAllTrees);           // Get all trees
router.get('/:id', getTreeById);        // Get one tree by ID
router.put('/:id', updateTree);         // Update a tree
router.delete('/:id', deleteTree);      // Delete a tree

export default router;
