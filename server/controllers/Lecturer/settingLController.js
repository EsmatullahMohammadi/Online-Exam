
const bcrypt = require('bcryptjs');
const Lecturer = require('../../models/lecturer');

const getLecturer = async (req, res) => {
  const { email, password } = req.body; // Corrected variable names for clarity

  try {
    // Fetch the lecturer by email
    const lecturer = await Lecturer.findOne({ email });
    if (!lecturer) {
      return res.status(404).json({ message: 'Lecturer not found' });
    }

    // If a password is provided, validate it
    if (password) {
      const isPasswordValid = await bcrypt.compare(password, lecturer.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Password is incorrect' });
      }
    }

    // Return the lecturer data
    res.status(200).json({ message: 'Lecturer retrieved successfully', lecturer });
  } catch (error) {
    console.error(`Error retrieving lecturer: ${error.message}`);
    res.status(500).json({ message: 'Error retrieving lecturer', error: error.message });
  }
};

module.exports = { getLecturer };
