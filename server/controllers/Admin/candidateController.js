const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const Candidate = require('../../models/candidate'); // Adjust the path based on your folder structure
const Test = require('../../models/test')

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
    testId,
  } = req.body;

  try {
    // Check if candidate already exists
    let candidate = await Candidate.findOne({ email });
    if (candidate) {
      return res.status(400).json({ message: 'Candidate already exists' });
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
      testId,
    });

    // Save the candidate to the database
    await candidate.save();
    //  Add Candidate ID to the Test Model
    if (testId) {
      await Test.findByIdAndUpdate(
        testId,
        { $push: { candidates: candidate._id } }, // Add candidateId to test
        { new: true, useFindAndModify: false }
      );
    }
    // Send success message
    res.status(201).json({ message: 'Candidate added successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
// get all candidate
const getCandidates = async (req, res) => {
  try {
    // Retrieve all tests from the database
    const candidate = await Candidate.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "Candidate retrieved successfully!",
      candidate,
    });
  } catch (error) {
    console.error("Error retrieving candidate:", error.message);
    res.status(500).json({ error: "Failed to retrieve candidate" });
  }
};
// Editing a candidadte
const updateCandidate = async (req, res) => {
  const { id } = req.params;
  const { name, fatherName, university, faculty, department, educationDegree, phoneNumber, email, password } = req.body;

  try {
    // Create an update object without the password initially
    const updateFields = { name, fatherName, university, faculty, department, educationDegree, phoneNumber, email };

    // If password is not empty, add it to updateFields
    if (password && password.trim() !== "") {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateFields.password = hashedPassword;
    }

    // Find candidate by ID and update its fields
    const updatedCandidate = await Candidate.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true } // Return updated document & validate fields
    );

    if (!updatedCandidate) {
      return res.status(404).json({ message: "Candidate not found!" });
    }

    res.status(200).json({
      message: "Candidate updated successfully!",
      candidate: updatedCandidate,
    });
  } catch (error) {
    console.error("Error updating candidate:", error.message);
    res.status(500).json({ error: "Failed to update candidate" });
  }
};


module.exports = { addCandidate, getCandidates, updateCandidate };
