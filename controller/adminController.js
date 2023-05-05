const bcrypt = require('bcryptjs');
const Admin = require('../models/adminModel');

exports.registerAdmin = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingAdmin = await Admin.exists({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newAdmin = new Admin({
      email,
      password: hashedPassword,
      name,
    });

    await newAdmin.save();

    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (!existingAdmin) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, existingAdmin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    req.session.adminId = existingAdmin._id;

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.logoutAdmin = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
      }
      res.status(200).json({ message: 'Logout successful' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.checkAdmin = async (req, res, next) => {
  try {
    if (!req.session.adminId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const existingAdmin = await Admin.findById(req.session.adminId);
    if (!existingAdmin) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.admin = existingAdmin;

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
