const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testSchema = new Schema({
      title: { type: String, required: true },
      examDuration: { type: Number, required: true },
      numberOfQuestions: { type: Number, required: true },
      totalMarks: { type: Number, required: true },
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      description: { type: String, required: true },
      questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }], // Linking Questions
},{timestamps: true})

const Test = mongoose.model('Test', testSchema);
module.exports= Test;