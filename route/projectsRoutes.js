const express = require('express');
const router = express.Router();
const projectController = require('../controller/projectsController');
const multer = require('multer');
const { storage } = require("../cloudinary");

// Multer middleware configuration
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Please Enter Valid file type"));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5 MB file size limit
  },
});

// Create new project
router.post('/', upload.single('coverImage'), projectController.createProject);

// Get all projects
router.get('/', projectController.getAllProjects);

// Get single project by ID
router.get('/:id', projectController.getProjectById);

// Update project by ID
router.put('/:id', upload.single('coverImage'), projectController.updateProjectById);

// Delete project by ID
router.delete('/:id', projectController.deleteProjectById);

// Log unhandled errors
router.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});

module.exports = router;
