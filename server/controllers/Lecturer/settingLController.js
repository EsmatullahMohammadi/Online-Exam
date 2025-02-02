
const bcrypt = require('bcryptjs');
const Lecturer = require('../../models/lecturer');

const getLecturer = async (req, res) => {
  const { email, password } = req.body; // Corrected variable names for clarity

  try {
    // Fetch the lecturer by email
    const lecturer = await Lecturer.findOne({ email });
    if (!lecturer) {
      return res.status(404).json({ message: 'Invalid email or password' });
    }

    // If a password is provided, validate it
    if (password) {
      const isPasswordValid = await bcrypt.compare(password, lecturer.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
    }

    // Return the lecturer data
    res.status(200).json({ message: 'Lecturer retrieved successfully', lecturer });
  } catch (error) {
    console.error(`Error retrieving lecturer: ${error.message}`);
    res.status(500).json({ message: 'Error retrieving lecturer', error: error.message });
  }
};

// edit lecturer
const editLecturer = async (req, res) => {
  const { name, lastName, email, currentPassword, newPassword } = req.body;
  const { lecturerId } = req.params;

  try {
    // Find the lecturer by ID
    const lecturer = await Lecturer.findById(lecturerId);
    if (!lecturer) {
      return res.status(404).json({ message: "Lecturer not found" });
    }

    // Check if current password matches the stored password
    const isPasswordValid = await bcrypt.compare(currentPassword, lecturer.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Update fields if provided
    if (name) lecturer.name = name;
    if (lastName) lecturer.lastName = lastName;
    if (email && email !== lecturer.email) {
      const emailExists = await Lecturer.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email address is already in use" });
      }
      lecturer.email = email;
    }
    
    // If a new password is provided, hash and update it
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      lecturer.password = hashedPassword;
    }
    // Save the updated lecturer
    await lecturer.save();
    res.status(200).json({ message: "Lecturer updated successfully", lecturer });
  } catch (error) {
    console.error(`Error updating lecturer: ${error.message}`);
    res.status(500).json({ message: "Error updating lecturer", error: error.message });
  }
};

module.exports = { getLecturer, editLecturer };
