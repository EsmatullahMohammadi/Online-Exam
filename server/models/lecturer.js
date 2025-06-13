const mongoose = require('mongoose');

const LecturerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true},
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true},
  category: { type: String, required: true,
    enum: ['Reading', 'Writing', 'Grammar', 'Listening'], 
  },
  profileImage: { type: String, default: "" },
},{timestamps: true});

const Lecturer = mongoose.model('Lecturer', LecturerSchema);

module.exports = Lecturer;
