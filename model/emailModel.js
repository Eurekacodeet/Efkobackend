const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  from: { type: String, required: true },
  subject: { type: String},
  text: { type: String, required: true },
  phoneNumber: { type: String},
  fullName: { type: String, required: true },



  createdAt: { type: Date, default: Date.now },
});

const Email = mongoose.model('Email', emailSchema);

module.exports = Email;