const mongoose = require("mongoose");

const candidateResponseSchema = new mongoose.Schema({
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate", required: true },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
  answers: { type: Map, of: String, required: true }, // Maps questionId → selectedOption
  score: { type: Number, default: 0 },
  submittedAt: { type: Date, default: Date.now }
});

const CandidateResponse = mongoose.model("CandidateResponse", candidateResponseSchema);
module.exports = CandidateResponse;
