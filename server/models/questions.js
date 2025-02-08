const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: function (v) {
        if (this.category === "Listening") {
          return v.length === 2 || v.length === 4; // Accept 2 or 4 options for Listening
        }
        return v.length === 4; // All other categories must have 4 options
      },
      message: (props) => `Invalid number of options for category: ${props.value.length} given`,
    },
  },
  correctAnswer: { type: String, required: true },
  category: { type: String, required: true },
  listeningFile: { type: String }, // Optional field for Listening questions
},{timestamps: true});

const Question= mongoose.model("Question", QuestionSchema);
module.exports = Question;
