const bcrypt = require('bcryptjs');
const Admin = require('../model/adminModel');

exports.registerAdmin = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingAdmin = await Admin.findOne({ email });
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

    // Store additional admin data in the session
    req.session.adminData = {
      id:existingAdmin._id,
      email: existingAdmin.email,
      name: existingAdmin.name,
    };

    // Store the admin ID in the session as well
    // req.session.adminId = existingAdmin._id;

    res.status(200).json({ message: 'Login successful', adminData: req.session.adminData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.logoutAdmin = async (req, res) => {
  try {
    req.session.destroy();
    res.status(200).json({ message: 'Logout successful' });
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
