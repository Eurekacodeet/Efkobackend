const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');

// Import the session middleware
const session = require('express-session');

// Register new admin
router.post('/register', adminController.registerAdmin);

// Configure and use the session middleware before the route configurations
router.use(
  session({
    secret: 'your-secret-key', // Replace with your preferred secret key
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Session duration (e.g., 1 day)
    },
  })
);

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
