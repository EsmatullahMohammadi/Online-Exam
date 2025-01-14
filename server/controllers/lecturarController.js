const Lecturer = require('../models/lecturar');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

// Add a lecturar
const addLecturar= async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } 
    const { name, lastName, email, password } = req.body;
    try {
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
module.exports= {addLecturar}