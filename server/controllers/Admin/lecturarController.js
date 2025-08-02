const Lecturer = require('../../models/lecturer');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const addLecturar = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, lastName, email, password, category } = req.body; // Extract category
  try {
    const validCategories = ['Reading', 'Writing', 'Grammar', 'Listening'];
    if (!validCategories.includes(category)) {
      return res
        .status(400)
        .json({ message: `Invalid category. Valid options are: ${validCategories.join(', ')}` });
    }

    let lecturer = await Lecturer.findOne({ email });
    if (lecturer) {
      return res.status(400).json({ message: 'Lecturer already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    lecturer = new Lecturer({
      name,
      lastName,
      email,
      password: hashedPassword,
      category,
    });

    await lecturer.save();

    res.status(201).json({ message: 'Lecturer added successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const getLecturar = async (req, res) => {
  try {
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

const deleteLecturer = async (req, res) => {
  const { id } = req.params;

  try {

    const deletedLecturer = await Lecturer.findByIdAndDelete(id);

    if (!deletedLecturer) {
      return res.status(404).json({ message: "Lecturer not found!" });
    }

    res.status(200).json({
      message: "Leccturer deleted successfully!",
      test: deletedLecturer,
    });
  } catch (error) {
    console.error("Error deleting test:", error.message);
    res.status(500).json({ error: "Failed to delete test" });
  }
};

module.exports= {addLecturar, getLecturar,  deleteLecturer}