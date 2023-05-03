const mongoose = require('mongoose');

const serviceModelSchema = new mongoose.Schema({
  icon: String,
  title: String,
  description: String,
  link: String
});

const serviceModel= mongoose.model('MobileApp', serviceModelSchema);

module.exports = serviceModel;
