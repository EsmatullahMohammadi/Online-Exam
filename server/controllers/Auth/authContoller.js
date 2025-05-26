const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const JWT = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();
const Setting = require("../../models/setting");
const Lecturer = require("../../models/lecturer");
const Candidate = require("../../models/candidate");

const auth = async (req, res) => {
  const { emailAddress, password, role } = req.body;
  if (role === "Admin") {
    try {
      const setting = await Setting.findOne();
      if (!setting) {
        return res.status(404).json({ message: "Admin not found" });
      }

      if (emailAddress && emailAddress !== setting.emailAddress) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      if (password) {
        const isPasswordValid = await bcrypt.compare(
          password,
          setting.currentPassword
        );
        if (!isPasswordValid) {
          return res.status(400).json({ message: "Invalid email or password" });
        }
      }

      const token = JWT.sign({ _id: setting._id }, process.env.TOKEN_KEY, {
        expiresIn: "1h",
      });
      res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });
      res.status(200).json({
        message: "Admin retrieved successfully",
        role: role,
        name: setting.fullName,
        adminId: setting._id,
      });
    } catch (error) {
      console.error(`Error retrieving settings: ${error.message}`);
      res
        .status(500)
        .json({ message: "Error retrieving settings", error: error.message });
    }
  } else if (role === "Lecturer") {
    try {
      const email = emailAddress;
      const lecturer = await Lecturer.findOne({ email });
      if (!lecturer) {
        return res.status(404).json({ message: "Invalid email or password" });
      }
      if (password) {
        const isPasswordValid = await bcrypt.compare(
          password,
          lecturer.password
        );
        if (!isPasswordValid) {
          return res.status(400).json({ message: "Invalid email or password" });
        }
      }
      const lecturerToken = JWT.sign(
        { _id: lecturer._id },
        process.env.TOKEN_KEY,
        { expiresIn: "1h" }
      );
      res.cookie("lecturerToken", lecturerToken, {
        httpOnly: true,
        maxAge: 3600000,
      });
      res.status(200).json({
        message: "Lecturer retrieved successfully",
        role: role,
        name: `${lecturer.name} ${lecturer.lastName}`,
        category: lecturer.category,
        lecturerID: lecturer._id,
      });
    } catch (error) {
      console.error(`Error retrieving lecturer: ${error.message}`);
      res
        .status(500)
        .json({ message: "Error retrieving lecturer", error: error.message });
    }
  } else if (role === "Candidate") {
    try {
      const userName = emailAddress;
      const candidate = await Candidate.findOne({ userName });

      if (!candidate) {
        return res.status(404).json({ message: "Invalid userName/email" });
      }

      if (password) {
        const decryptedPassword = decryptAES(candidate.password);

        if (decryptedPassword !== password) {
          return res.status(400).json({ message: "Invalid userName/email or password" });
        }
      }

      const candidateToken = JWT.sign(
        { _id: candidate._id },
        process.env.TOKEN_KEY,
        { expiresIn: "1h" }
      );

      res.cookie("candidateToken", candidateToken, {
        httpOnly: true,
        maxAge: 3600000,
      });

      res.status(200).json({
        message: "Candidate retrieved successfully",
        role: role,
        name: candidate.name,
        id: candidate._id,
      });
    } catch (error) {
      console.error(`Error retrieving candidate: ${error.message}`);
      res.status(500).json({
        message: "Error retrieving candidate",
        error: error.message,
      });
    }
  }
};

// forget password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    // Fetch the user setting (assuming there is only one record)
    const setting = await Setting.findOne({ email });
    if (!setting) {
      return res.status(404).json({ message: "User not registered." });
    }
    // Create a transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use a supported email service
      auth: {
        user: "your-email@gmail.com", // Replace with your email
        pass: "your-email-password", // Replace with your email password or app-specific password
      },
    });

    // Email options
    const mailOptions = {
      from: "your-email@gmail.com",
      to: "recipient-email@example.com",
      subject: "Test Email",
      text: "This is a test email sent from Node.js using Nodemailer.",
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const decryptAES = (encryptedText) => {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    crypto.createHash("sha256").update(process.env.AESSECRET).digest(),
    Buffer.alloc(16, 0)
  );
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

module.exports = { auth, forgotPassword };
