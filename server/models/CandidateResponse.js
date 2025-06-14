const mongoose = require("mongoose");

const candidateResponseSchema = new mongoose.Schema({
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate", required: true },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
  answers: { 
    type: Map, 
    of: new mongoose.Schema({
      questionId: mongoose.Schema.Types.ObjectId,
      answer: String,
      isCorrect: Boolean
    }), 
    default: new Map() 
  },
  currentPage: { type: Number, default: 1 },
  score: { type: Number, default: 0 },
  obtainedMarks: { type: Number, default: 0 },
  status: { type: String, enum: ["Passed", "Failed", "Pending"], default: "Pending" },
  lastSaved: { type: Date },
  submittedAt: { type: Date }
}, { timestamps: true });

const CandidateResponse = mongoose.model("CandidateResponse", candidateResponseSchema);
module.exports = CandidateResponse;