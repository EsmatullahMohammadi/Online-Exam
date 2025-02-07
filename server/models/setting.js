const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true},
    phoneNumber: { type: String, required: true },
    emailAddress: { type: String, required: true, unique: true },
    currentPassword: { type: String, required: true },
    profileImage: { type: String, default: "" }, // Store image URL
  },
  {timestamps: true}
);

module.exports = mongoose.model('Setting', SettingsSchema);
