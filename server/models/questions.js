const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: function (v) {
        if (this.category === "Listening") {
          return v.length === 2 || v.length === 4;
        }
        return v.length === 4;
      },
      message: (props) => `Invalid number of options for category: ${props.value.length} given`,
    },
  },
  correctAnswer: { type: String, required: true },
  category: { type: String, required: true },
  listeningFile: { type: String },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lecturer",
    required: true,
  },
},{timestamps: true});

const Question= mongoose.model("Question", QuestionSchema);
module.exports = Question;
