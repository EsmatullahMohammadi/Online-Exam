const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true},
    phoneNumber: { type: String, required: true },
    emailAddress: { type: String, required: true, unique: true },
    currentPassword: { type: String, required: true },
  },
  {timestamps: true}
);

module.exports = mongoose.model('Setting', SettingsSchema);
