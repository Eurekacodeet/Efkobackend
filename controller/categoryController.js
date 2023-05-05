const Category = require('../model/categoryModel');

// Create a new category
exports.createCategory = (req, res) => {
  const { name, description } = req.body;

  const category = new Category({
    name,
    description,
  });

  category.save()
    .then((createdCategory) => {
      res.status(201).json(createdCategory);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to create category' });
    });
};

// Get all categories
exports.getAllCategories = (req, res) => {
  Category.find()
    .then((categories) => {
      res.json(categories);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to fetch categories' });
    });
};

// Get a specific category by ID
exports.getCategoryById = (req, res) => {
  const categoryId = req.params.categoryId;

  Category.findById(categoryId)
    .then((category) => {
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.json(category);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to fetch category' });
    });
};

// Update a category
exports.updateCategory = (req, res) => {
  const categoryId = req.params.categoryId;
  const { name, description } = req.body;

  Category.findByIdAndUpdate(categoryId, { name, description }, { new: true })
    .then((updatedCategory) => {
      if (!updatedCategory) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.json(updatedCategory);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to update category' });
    });
};

// Delete a category
exports.deleteCategory = (req, res) => {
  const categoryId = req.params.categoryId;

  Category.findByIdAndDelete(categoryId)
    .then((deletedCategory) => {
      if (!deletedCategory) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.json({ message: 'Category deleted successfully' });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to delete category' });
    });
};