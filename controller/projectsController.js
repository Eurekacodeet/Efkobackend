const Project = require('../model/projectsModel');

// Create new project
exports.createProject = async (req, res) => {
try {
const { projectName,projectDescription, content } = req.body;
const parsedData=JSON.parse(content)
const project = new Project({
projectName,
projectDescription,
coverImage: req.file.path, // Save file path to coverImage field
content:parsedData
});
console.log(project);
await project.save();
res.status(201).json(project);
} catch (error) {
console.error(error);
res.status(500).json({ message: 'Server error' });
}
};

// Get all projects
exports.getAllProjects = async (req, res) => {
try {
const projects = await Project.find();
res.status(200).json(projects);
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
const { projectName,projectDescription, content } = req.body;
console.log(req.body)
const parsedData=JSON.parse(content)

coverImage = req.file ? req.file.path : undefined;
const updateData = { projectName,projectDescription, content:parsedData,coverImage };
console.log(updateData);
// If a new file is uploaded, update the coverImage field


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
res.status(500)}}