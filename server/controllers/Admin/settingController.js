const bcrypt = require('bcryptjs');
const Setting = require('../../models/setting');
const Candidate = require('../../models/candidate');
const Lecturer = require('../../models/lecturer');
const fs = require("fs");
const path = require("path");
const multer = require("multer");

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "userImage/"); // Save images in userImage folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Controller the edit images
const editAdminImage = async (req, res) => {
  try {
    const { id, role } = req.params;
    if(role==="Admin"){
      const admin = await Setting.findById(id);
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }
      // Check if there was a previous image
      if (admin.profileImage) {
        const oldImagePath = path.join(__dirname, "../../userImage/", admin.profileImage);
        // Ensure the old image exists before trying to delete it
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); // Delete the old image
        }
      }
      // Ensure a new file was uploaded
      if (!req.file) {
        return res.status(400).json({ message: "No image uploaded" });
      }
      // Update profile image in DB
      admin.profileImage = req.file.filename;
      await admin.save();
      res.status(200).json({ message: "Profile image updated successfully", imageUrl: req.file.filename });
    }
    if(role==="Lecturer"){
      const lecturer = await Lecturer.findById(id);
      if (!lecturer) {
        return res.status(404).json({ message: "lecturer not found" });
      }
      // Check if there was a previous image
      if (lecturer.profileImage) {
        const oldImagePath = path.join(__dirname, "../../userImage/", lecturer.profileImage);
        // Ensure the old image exists before trying to delete it
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); // Delete the old image
        }
      }
      // Ensure a new file was uploaded
      if (!req.file) {
        return res.status(400).json({ message: "No image uploaded" });
      }
      // Update profile image in DB
      lecturer.profileImage = req.file.filename;
      await lecturer.save();
      res.status(200).json({ message: "Profile image updated successfully", imageUrl: req.file.filename });
    }
    if(role==="Candidate"){
      const candidate = await Candidate.findById(id);
      if (!candidate) {
        return res.status(404).json({ message: "candidate not found" });
      }
      // Check if there was a previous image
      if (candidate.profileImage) {
        const oldImagePath = path.join(__dirname, "../../userImage/", candidate.profileImage);
        // Ensure the old image exists before trying to delete it
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); // Delete the old image
        }
      }
      // Ensure a new file was uploaded
      if (!req.file) {
        return res.status(400).json({ message: "No image uploaded" });
      }
      // Update profile image in DB
      candidate.profileImage = req.file.filename;
      await candidate.save();
      res.status(200).json({ message: "Profile image updated successfully", imageUrl: req.file.filename });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating profile image", error: error.message });
  }
};
// Fetch admin image 
const getImage= async (req, res) =>{
  try {
    const { id, role } = req.params;
    if(role === "Admin"){
      const admin = await Setting.findById(id);
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }
      res.json({ profileImage: admin.profileImage }); // Send back the image filename
    }
    if(role === "Lecturer"){
      const lecturar = await Lecturer.findById(id);
      if (!lecturar) {
        return res.status(404).json({ message: "lecturar not found" });
      }
      res.json({ profileImage: lecturar.profileImage }); // Send back the image filename
    }
    if(role === "Candidate"){
      const candidate = await Candidate.findById(id);
      if (!candidate) {
        return res.status(404).json({ message: "candidate not found" });
      }
      res.json({ profileImage: candidate.profileImage }); // Send back the image filename
    }

  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
}


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

module.exports = { editSetting, getSetting, upload, editAdminImage, getImage };
