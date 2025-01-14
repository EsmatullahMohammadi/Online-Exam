const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Lecturer schema definition
const LecturerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true},
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true},
},{timestamps: true});
// Create Lecturer model
const Lecturer = mongoose.model('Lecturer', LecturerSchema);

module.exports = Lecturer;
