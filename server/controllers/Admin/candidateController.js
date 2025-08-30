const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const Candidate = require("../../models/candidate");
const Test = require("../../models/test");
const crypto = require("crypto");
const { encryptAES, decryptAES } = require("../../utils/cryptoUtils");

const addCandidate = async (req, res) => {
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
    const existingByPhone = await Candidate.findOne({ phoneNumber });
    if (existingByPhone) {
      return res.status(400).json({ message: "Phone number already exists" });
    }

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

    const randomPassword = generateRandomNumberString(8);

    const encryptedPassword = encryptAES(randomPassword);

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

    await candidate.save();

    if (testId) {
      await Test.findByIdAndUpdate(
        testId,
        { $push: { candidates: candidate._id } },
        { new: true }
      );
    }

    res.status(201).json({
      message: "Candidate added successfully",
      candidateId: candidate._id,
      userName: randomUserName,
      password: randomPassword,
    });
  } catch (err) {
    console.error("Error adding candidate:", err.message);
    res.status(500).send("Server Error");
  }
};

const getCandidates = async (req, res) => {
  try {
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
      return res.status(400).json({ error: "testId is required" });
    }

    const candidates = await Candidate.find({ testId }).sort({ createdAt: -1 });

    const candidatesWithDecryptedPassword = candidates.map((candidate) => {
      const decryptedPassword = decryptAES(candidate.password);
      return {
        ...candidate.toObject(),
        password: decryptedPassword,
      };
    });

    res.status(200).json({
      message: "Candidate retrieved successfully",
      candidates: candidatesWithDecryptedPassword,
    });
  } catch (error) {
    console.error("Error retrieving candidates by test:", error.message);
    res.status(500).json({ error: "Error retrieving candidates" });
  }
};

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
    userName,
    password,
  } = req.body;

  try {
    const updateFields = {
      name,
      fatherName,
      university,
      faculty,
      department,
      educationDegree,
      phoneNumber,
      userName,
    };

    if (password && password.trim() !== "") {
      updateFields.password = encryptAES(password);
    }

    const updatedCandidate = await Candidate.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
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
const deleteTest = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCandidate = await Candidate.findByIdAndDelete(id);

    if (!deletedCandidate) {
      return res.status(404).json({ message: "Candidate not found!" });
    }

    res.status(200).json({
      message: "Candidate deleted successfully!",
      candidate: deletedCandidate,
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
