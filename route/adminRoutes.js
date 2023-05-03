const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Register new admin
router.post('/register', adminController.registerAdmin);

// Login admin
router.post('/login', adminController.loginAdmin);

// Logout admin
router.get('/logout', adminController.logoutAdmin);

// Middleware to check if user is logged in as admin
router.use(adminController.checkAdmin);

// Admin-only routes below
// Example:
router.get('/dashboard', (req, res) => {
  res.send(`Welcome, ${req.admin.name}!`);
});

module.exports = router;
