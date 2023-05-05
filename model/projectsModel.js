// models/projectsModel.js
const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true
  },
  projectDescription:{
    type: String,
    required: true
  },
  coverImage: {
    type: String,
    required: true
  },
  content: {
    type:Object,
      category: {
        type: String,
        required: true
      },
      link: {
        type: String,
      },
  },
  createdAt: { type: Date, default: Date.now },

});

module.exports = mongoose.model('Project', ProjectSchema);
