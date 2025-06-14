const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema(
  {
    passage: { type: String }, // For Reading passages
    listeningFile: { type: String }, // For Listening audio files
    questions: [
      {
        questionText: { type: String, required: true },
        options: {
          type: [String],
          required: true,
          validate: {
            validator: function (v) {
              if (this.parent().category === "Listening") {
                return v.length === 2 || v.length === 4;
              }
              return v.length === 4;
            },
            message: (props) =>
              `Invalid number of options for category: ${props.value.length} given`,
          },
        },
        correctAnswer: { type: String, required: true },
      },
    ],
    category: {
      type: String,
      required: true,
      enum: ["Reading", "Listening", "Grammar", "Writing"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecturer",
      required: true,
    },
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", QuestionSchema);
module.exports = Question;
