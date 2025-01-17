const Lecturer = require('../../models/lecturer');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

// Add a lecturer
const addLecturar = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, lastName, email, password, category } = req.body; // Extract category
  try {
    // Validate the category
    const validCategories = ['Reading', 'Writing', 'Speaking', 'Listening'];
    if (!validCategories.includes(category)) {
      return res
        .status(400)
        .json({ msg: `Invalid category. Valid options are: ${validCategories.join(', ')}` });
    }

    // Check if lecturer already exists
    let lecturer = await Lecturer.findOne({ email });
    if (lecturer) {
      return res.status(400).json({ msg: 'Lecturer already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new lecturer object
    lecturer = new Lecturer({
      name,
      lastName,
      email,
      password: hashedPassword,
      category, // Include category
    });

    // Save the lecturer to the database
    await lecturer.save();

    // Send success message
    res.status(201).json({ msg: 'Lecturer added successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
// get all lecturare
const getLecturar = async (req, res) => {
  try {
    // Retrieve all tests from the database
    const lecturar = await Lecturer.find().sort({createdAt: -1});
    res.status(200).json({
      message: "Lecturer retrieved successfully!",
      lecturar,
    });
  } catch (error) {
    console.error("Error retrieving tests:", error.message);
    res.status(500).json({ error: "Failed to retrieve lecturar" });
  }
};
// Deleting a lecturar by ID
const deleteLecturer = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the lecturar by ID and delete it
    const deletedLecturer = await Lecturer.findByIdAndDelete(id);

    if (!deletedLecturer) {
      return res.status(404).json({ message: "Lecturer not found!" });
    }

    res.status(200).json({
      message: "Leccturer deleted successfully!",
      test: deletedLecturer, // Optionally return the deleted test details
    });
  } catch (error) {
    console.error("Error deleting test:", error.message);
    res.status(500).json({ error: "Failed to delete test" });
  }
};

module.exports= {addLecturar, getLecturar,  deleteLecturer}