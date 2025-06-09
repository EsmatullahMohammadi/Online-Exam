const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testSchema = new Schema(
  {
    title: { type: String, required: true },
    examDuration: { type: Number, required: true },
    numberOfQuestions: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    startDate: { type: Date, required: false },
    endDate: { type: Date, required: false },
    description: { type: String, required: true },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
    candidates: [{ type: mongoose.Schema.Types.ObjectId, ref: "Candidate" }],
  },
  { timestamps: true }
);

const Test = mongoose.model('Test', testSchema);
module.exports= Test;