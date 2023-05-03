const mongoose = require('mongoose');
const { Schema } = mongoose;

const AdminSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Admin', AdminSchema);
