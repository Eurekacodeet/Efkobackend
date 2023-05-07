const Blog = require('../model/blogModel');
const Email = require('../model/emailModel'); // Assuming you have an emailModel file
const Project = require('../model/projectsModel'); // Assuming you have a projectModel file
const mongoose = require('mongoose');

exports.countBlogs = async (req, res) => {
  try {
    const count = await Blog.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error('Error counting documents:', error);
    res.status(500).json({ error: 'An error occurred' });
  } finally {
    // Disconnect from MongoDB
    mongoose.disconnect();
  }
};

exports.projectsCount = async (req, res) => {
  try {
    const count = await Project.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error('Error counting documents:', error);
    res.status(500).json({ error: 'An error occurred' });
  } finally {
    // Disconnect from MongoDB
    mongoose.disconnect();
  }
};

exports.emailCount = async (req, res) => {
  try {
    const count = await Email.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error('Error counting documents:', error);
    res.status(500).json({ error: 'An error occurred' });
  } finally {
    // Disconnect from MongoDB
    mongoose.disconnect();
  }
};
