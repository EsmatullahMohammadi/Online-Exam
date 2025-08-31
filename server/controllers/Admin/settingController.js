const bcrypt = require("bcryptjs");
const Setting = require("../../models/setting");
const Candidate = require("../../models/candidate");
const Lecturer = require("../../models/lecturer");
const Question = require("../../models/questions");
const Test = require("../../models/test");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "userImage/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const editAdminImage = async (req, res) => {
  try {
    const { id, role } = req.params;
    if (role === "Admin") {
      const admin = await Setting.findById(id);
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }
      if (admin.profileImage) {
        const oldImagePath = path.join(
          __dirname,
          "../../userImage/",
          admin.profileImage
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      if (!req.file) {
        return res.status(400).json({ message: "No image uploaded" });
      }
      admin.profileImage = req.file.filename;
      await admin.save();
      res.status(200).json({
        message: "Profile image updated successfully",
        imageUrl: req.file.filename,
      });
    }
    if (role === "Lecturer") {
      const lecturer = await Lecturer.findById(id);
      if (!lecturer) {
        return res.status(404).json({ message: "lecturer not found" });
      }
      if (lecturer.profileImage) {
        const oldImagePath = path.join(
          __dirname,
          "../../userImage/",
          lecturer.profileImage
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      if (!req.file) {
        return res.status(400).json({ message: "No image uploaded" });
      }
      lecturer.profileImage = req.file.filename;
      await lecturer.save();
      res.status(200).json({
        message: "Profile image updated successfully",
        imageUrl: req.file.filename,
      });
    }
    if (role === "Candidate") {
      const candidate = await Candidate.findById(id);
      if (!candidate) {
        return res.status(404).json({ message: "candidate not found" });
      }
      if (candidate.profileImage) {
        const oldImagePath = path.join(
          __dirname,
          "../../userImage/",
          candidate.profileImage
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      if (!req.file) {
        return res.status(400).json({ message: "No image uploaded" });
      }
      candidate.profileImage = req.file.filename;
      await candidate.save();
      res.status(200).json({
        message: "Profile image updated successfully",
        imageUrl: req.file.filename,
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating profile image", error: error.message });
  }
};
const getImage = async (req, res) => {
  try {
    const { id, role } = req.params;
    if (role === "Admin") {
      const admin = await Setting.findById(id);
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }
      res.json({ profileImage: admin.profileImage });
    }
    if (role === "Lecturer") {
      const lecturar = await Lecturer.findById(id);
      if (!lecturar) {
        return res.status(404).json({ message: "lecturar not found" });
      }
      res.json({ profileImage: lecturar.profileImage });
    }
    if (role === "Candidate") {
      const candidate = await Candidate.findById(id);
      if (!candidate) {
        return res.status(404).json({ message: "candidate not found" });
      }
      res.json({ profileImage: candidate.profileImage });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const editSetting = async (req, res) => {
  const { emailAddress, fullName, phoneNumber, currentPassword, newPassword } =
    req.body;

  try {
    const setting = await Setting.findOne();
    if (!setting) {
      return res.status(404).json({ message: "Settings not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      setting.currentPassword
    );
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    if (emailAddress && emailAddress !== setting.emailAddress) {
      const emailExists = await Setting.findOne({ emailAddress });
      if (emailExists) {
        return res
          .status(400)
          .json({ message: "Email address is already in use" });
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
    res.status(200).json({ message: "Settings updated successfully", setting });
  } catch (error) {
    console.error(`Error updating settings: ${error.message}`);
    res
      .status(501)
      .json({ message: "Error updating settings", error: error.message });
  }
};

const getSetting = async (req, res) => {
  const { emailAddress, password } = req.body; // Both email and password are optional for validation
  try {
    // Fetch the user setting (assuming there is only one record)
    const setting = await Setting.findOne();
    if (!setting) {
      return res.status(404).json({ message: "Settings not found" });
    }

    // If an email address is provided, validate it
    if (emailAddress && emailAddress !== setting.emailAddress) {
      return res.status(400).json({ message: "Email address is incorrect" });
    }

    // If a password is provided, validate it
    if (password) {
      const isPasswordValid = await bcrypt.compare(
        password,
        setting.currentPassword
      );
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Password is incorrect" });
      }
    }

    // Return the setting data
    res
      .status(200)
      .json({ message: "Settings retrieved successfully", setting });
  } catch (error) {
    console.error(`Error retrieving settings: ${error.message}`);
    res
      .status(500)
      .json({ message: "Error retrieving settings", error: error.message });
  }
};

const countAll = async (req, res) => {
  try {
    const candidateCount = await Candidate.countDocuments();
    const lecturerCount = await Lecturer.countDocuments();
    const testCount = await Test.countDocuments();

    // Count total number of sub-questions across all documents
    const questionAgg = await Question.aggregate([
      { $project: { numQuestions: { $size: "$questions" } } },
      { $group: { _id: null, totalQuestions: { $sum: "$numQuestions" } } },
    ]);

    const questionCount = questionAgg[0]?.totalQuestions || 0;

    res.status(200).json({
      candidates: candidateCount,
      questions: questionCount, // 👈 total number of sub-questions
      lecturers: lecturerCount,
      tests: testCount,
    });
  } catch (error) {
    console.error("Error fetching counts:", error);
    res
      .status(500)
      .json({ message: "Error fetching counts", error: error.message });
  }
};

module.exports = {
  editSetting,
  getSetting,
  upload,
  editAdminImage,
  getImage,
  countAll,
};
