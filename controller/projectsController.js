const Project = require('../model/projectsModel');

// Create new project
exports.createProject = async (req, res) => {
  try {
    const { projectName, projectDescription, content } = req.body;
    let parsedData;
    try {
      parsedData = JSON.parse(content);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: 'Invalid JSON content' });
    }
    const project = new Project({
      projectName,
      projectDescription,
      coverImage: req.file ? req.file.path : undefined,
      content: parsedData,
    });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all projects with pagination
exports.getAllProjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const total = await Project.countDocuments();

    const pagination = {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    };

    const projects = await Project.find().skip(startIndex).limit(limit);

    res.status(200).json({ projects, pagination });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update project by ID
exports.updateProjectById = async (req, res) => {
  try {
    const { projectName, projectDescription, content } = req.body;
    let parsedData;
    try {
      parsedData = JSON.parse(content);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: 'Invalid JSON content' });
    }
    const updateData = {
      projectName,
      projectDescription,
      content: parsedData,
      coverImage: req.file ? req.file.path : undefined,
    };
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete project by ID
exports.deleteProjectById = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json({ message: 'Project deleted successfully' });
} catch (error) {
console.error(error);
res.status(500).json({ message: 'Server error' });
}
};
   
