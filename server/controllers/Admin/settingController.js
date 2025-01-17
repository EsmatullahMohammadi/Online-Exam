const bcrypt = require('bcryptjs');
const Setting = require('../../models/setting');

const editSetting = async (req, res) => {
  const { emailAddress, fullName, phoneNumber, currentPassword, newPassword } = req.body;

  try {
    // Fetch the single user setting (assuming there is only one record)
    const setting = await Setting.findOne();
    if (!setting) {
      return res.status(404).json({ message: 'Settings not found' });
    }

    // Check if current password matches the stored password
    const isPasswordValid = await bcrypt.compare(currentPassword, setting.currentPassword);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update fields if provided
    if (emailAddress && emailAddress !== setting.emailAddress) {
      const emailExists = await Setting.findOne({ emailAddress });
      if (emailExists) {
        return res.status(400).json({ message: 'Email address is already in use' });
      }
      setting.emailAddress = emailAddress;
    }
    if (fullName) setting.fullName = fullName;
    if (phoneNumber) setting.phoneNumber = phoneNumber;
    // If a new password is provided, hash and update it
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      setting.currentPassword = hashedPassword;
    }

    // Save the updated setting
    await setting.save();
    res.status(200).json({ message: 'Settings updated successfully', setting });
  } catch (error) {
    console.error(`Error updating settings: ${error.message}`);
    res.status(501).json({ message: 'Error updating settings', error: error.message });
  }
};

const getSetting = async (req, res) => {
  const { emailAddress, password } = req.body; // Both email and password are optional for validation
  try {
    // Fetch the user setting (assuming there is only one record)
    const setting = await Setting.findOne();
    if (!setting) {
      return res.status(404).json({ message: 'Settings not found' });
    }

    // If an email address is provided, validate it
    if (emailAddress && emailAddress !== setting.emailAddress) {
      return res.status(400).json({ message: 'Email address is incorrect' });
    }

    // If a password is provided, validate it
    if (password) {
      const isPasswordValid = await bcrypt.compare(password, setting.currentPassword);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Password is incorrect' });
      }
    }

    // Return the setting data
    res.status(200).json({ message: 'Settings retrieved successfully', setting });
  } catch (error) {
    console.error(`Error retrieving settings: ${error.message}`);
    res.status(500).json({ message: 'Error retrieving settings', error: error.message });
  }
};

module.exports = { editSetting, getSetting };
