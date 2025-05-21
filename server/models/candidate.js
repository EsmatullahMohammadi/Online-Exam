const mongoose = require("mongoose");

const CandidateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    fatherName: { type: String, required: true },
    university: { type: String, required: true },
    faculty: { type: String, required: true },
    department: { type: String, required: true },
    educationDegree: {
      type: String,
      required: true,
      enum: ["Lisans", "Master"],
    },
    phoneNumber: { type: String, required: true, unique: true },
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, default: "Pending" },
    testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test" },
    profileImage: { type: String, default: "" },
  },
  { timestamps: true }
);

const Candidate = mongoose.model("Candidate", CandidateSchema);

module.exports = Candidate;
