const express = require('express');
const router = express.Router();
const categoryController = require('../controller/categoryController');

// Create a new category
router.post('/', categoryController.createCategory);

// Get all categories
router.get('/', categoryController.getAllCategories);

// Get a specific category
router.get('/:categoryId', categoryController.getCategoryById);

// Update a category
router.put('/:categoryId', categoryController.updateCategory);

// Delete a category
router.delete('/:categoryId', categoryController.deleteCategory);

module.exports = router;