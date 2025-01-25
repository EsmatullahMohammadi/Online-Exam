const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
const Setting = require('../../models/setting');
const Lecturer = require('../../models/lecturer');

const auth = async (req, res) => {
    const { emailAddress, password, role } = req.body; 

    if(role==="Admin"){
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
        
        const token= JWT.sign({_id: setting._id}, process.env.TOKEN_KEY, {expiresIn: '1h'});
        res.cookie('token', token, {httpOnly: true, maxAge: 3600000})
        // Return the setting data
        res.status(200).json({ message: 'Settings retrieved successfully', role: role});
      } catch (error) {
        console.error(`Error retrieving settings: ${error.message}`);
        res.status(500).json({ message: 'Error retrieving settings', error: error.message });
      }
    }
    else if(role==="Lecturer"){
      try {
        // Fetch the lecturer by email
        const email= emailAddress;
        const lecturer = await Lecturer.findOne({ email });
        if (!lecturer) {
          return res.status(404).json({ message: 'Invalid email' });
        }
    
        // If a password is provided, validate it
        if (password) {
          const isPasswordValid = await bcrypt.compare(password, lecturer.password);
          if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
          }
        }
    
        // Return the lecturer data
        res.status(200).json({ message: 'Lecturer retrieved successfully', role: role });
      } catch (error) {
        console.error(`Error retrieving lecturer: ${error.message}`);
        res.status(500).json({ message: 'Error retrieving lecturer', error: error.message });
      }
    }
  };

  // forget password
  const forgotPassword = async (req, res) => {
    const { email } = req.body; 
    try {
      // Fetch the user setting (assuming there is only one record)
      const setting = await Setting.findOne({email});
      if (!setting) {
        return res.status(404).json({ message: 'User not registered.' });
      }
      // Create a transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail', // Use a supported email service
        auth: {
          user: 'your-email@gmail.com', // Replace with your email
          pass: 'your-email-password', // Replace with your email password or app-specific password
        },
      });

      // Email options
      const mailOptions = {
        from: 'your-email@gmail.com',
        to: 'recipient-email@example.com',
        subject: 'Test Email',
        text: 'This is a test email sent from Node.js using Nodemailer.',
      };

      // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
    } catch (error) {
      console.log(error)
    }
   
  };
  
  module.exports = { auth, forgotPassword };