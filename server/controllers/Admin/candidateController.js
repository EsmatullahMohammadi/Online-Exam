const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const Candidate = require("../../models/candidate"); // Adjust the path based on your folder structure
const Test = require("../../models/test");
const crypto = require("crypto");

const addCandidate = async (req, res) => {
  const AES_SECRET = crypto
    .createHash("sha256")
    .update(process.env.AESSECRET)
    .digest();

  // AES encryption function
  const encryptAES = (text) => {
    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      AES_SECRET,
      Buffer.alloc(16, 0)
    );
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  };

  // Validate incoming fields (except email/password)
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
    testId,
  } = req.body;

  try {
    // Ensure phone number is unique
    const existingByPhone = await Candidate.findOne({ phoneNumber });
    if (existingByPhone) {
      return res.status(400).json({ message: "Phone number already exists" });
    }

    // Generate random credentials
    const generateRandomNumberString = (length) => {
      return Math.random()
        .toString()
        .slice(2, 2 + length);
    };

    let randomUserName;
    let existingByUserName;
    do {
      randomUserName = `${name}@${generateRandomNumberString(5)}`;
      existingByUserName = await Candidate.findOne({
        userName: randomUserName,
      });
    } while (existingByUserName);

    const randomPassword = generateRandomNumberString(8); // 8-digit number

    // Encrypt password using AES 256
    const encryptedPassword = encryptAES(randomPassword);

    // Create a new candidate object with generated credentials
    const candidate = new Candidate({
      name,
      fatherName,
      university,
      faculty,
      department,
      educationDegree,
      phoneNumber,
      userName: randomUserName,
      password: encryptedPassword,
      testId,
    });

    // Save the candidate to the database (store encrypted password)
    await candidate.save();

    // Optionally add Candidate ID to the Test model
    if (testId) {
      await Test.findByIdAndUpdate(
        testId,
        { $push: { candidates: candidate._id } },
        { new: true }
      );
    }

    // Return generated credentials to the admin
    res.status(201).json({
      message: "Candidate added successfully",
      candidateId: candidate._id,
      userName: randomUserName,
      password: randomPassword, // plaintext password returned only to admin
    });
  } catch (err) {
    console.error("Error adding candidate:", err.message);
    res.status(500).send("Server Error");
  }
};

// get all candidate
const getCandidates = async (req, res) => {
  try {
    // Retrieve all tests from the database
    const candidate = await Candidate.find().sort({ createdAt: -1 });
    const tests = await Test.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "Candidate retrieved successfully!",
      candidate,
      tests,
    });
  } catch (error) {
    console.error("Error retrieving candidate:", error.message);
    res.status(500).json({ error: "Failed to retrieve candidate" });
  }
};

const getCandidatesByTest = async (req, res) => {
  try {
    const { testId } = req.query;
    if (!testId) {
      return res.status(400).json({ error: "testId is requiered" });
    }

    const AES_SECRET = crypto
      .createHash("sha256")
      .update(process.env.AESSECRET)
      .digest();

    // AES decryption function
    const decryptAES = (encryptedText) => {
      const decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        AES_SECRET,
        Buffer.alloc(16, 0)
      );
      let decrypted = decipher.update(encryptedText, "hex", "utf8");
      decrypted += decipher.final("utf8");
      return decrypted;
    };

    // Fetch candidates by testId
    const candidates = await Candidate.find({ testId }).sort({ createdAt: -1 });

    // Decrypt password for each candidate
    const candidatesWithDecryptedPassword = candidates.map((candidate) => {
      const decryptedPassword = decryptAES(candidate.password);
      return {
        ...candidate.toObject(),
        password: decryptedPassword,
      };
    });

    res.status(200).json({
      message: "Condiate retrived successfully",
      candidates: candidatesWithDecryptedPassword,
    });
  } catch (error) {
    console.error("Error retrieving candidates by test:", error.message);
    res.status(500).json({ error: "Error retriving condidates" });
  }
};

// Editing a candidadte
const updateCandidate = async (req, res) => {
  const { id } = req.params;
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
    // Create an update object without the password initially
    const updateFields = {
      name,
      fatherName,
      university,
      faculty,
      department,
      educationDegree,
      phoneNumber,
      email,
    };

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
// Deleting a candidate by ID
const deleteTest = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the test by ID and delete it
    const deletedCandidate = await Candidate.findByIdAndDelete(id);

    if (!deletedCandidate) {
      return res.status(404).json({ message: "Candidate not found!" });
    }

    res.status(200).json({
      message: "Candidate deleted successfully!",
      candidate: deletedCandidate, // Optionally return the deleted test details
    });
  } catch (error) {
    console.error("Error deleting candidate:", error.message);
    res.status(500).json({ error: "Failed to delete candidate" });
  }
};

module.exports = {
  addCandidate,
  getCandidates,
  updateCandidate,
  deleteTest,
  getCandidatesByTest,
};
