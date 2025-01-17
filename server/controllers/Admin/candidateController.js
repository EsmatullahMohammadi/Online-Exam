const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const Candidate = require('../../models/candidate'); // Adjust the path based on your folder structure

// Add a candidate
const addCandidate = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const {
    name,
    fatherName,
    university,
    faculty,
    department,
    educationDegree,
    phoneNumber,
    email,
    password,
  } = req.body;

  try {
    // Check if candidate already exists
    let candidate = await Candidate.findOne({ email });
    if (candidate) {
      return res.status(400).json({ msg: 'Candidate already exists' });
    }
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new candidate object
    candidate = new Candidate({
      name,
      fatherName,
      university,
      faculty,
      department,
      educationDegree,
      phoneNumber,
      email,
      password: hashedPassword,
    });

    // Save the candidate to the database
    await candidate.save();

    // Send success message
    res.status(201).json({ msg: 'Candidate added successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
// get all candidate
const getCandidates = async (req, res) => {
  try {
    // Retrieve all tests from the database
    const candidate = await Candidate.find().sort({createdAt: -1});
    res.status(200).json({
      message: "Candidate retrieved successfully!",
      candidate,
    });
  } catch (error) {
    console.error("Error retrieving candidate:", error.message);
    res.status(500).json({ error: "Failed to retrieve candidate" });
  }
};

module.exports = { addCandidate, getCandidates };
