const Question = require("../../models/questions");

const addQuestion = async (req, res) => {
  try {
    const createdBy = req.params.userId;
    const { passage, questions: questionsStr, category } = req.body;

    // Parse questions
    let questions;
    try {
      questions = JSON.parse(questionsStr);
    } catch (e) {
      return res.status(400).json({ message: "Invalid questions format" });
    }

    // Validate required fields
    if (category === "Reading" && !passage) {
      return res
        .status(400)
        .json({ message: "Passage is required for Reading questions." });
    }

    if (category === "Listening" && !req.file) {
      return res.status(400).json({
        message: "Listening file is required for Listening questions.",
      });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one question is required." });
    }

    // Process and validate each question
    const processedQuestions = questions.map((q) => {
      // Filter out empty options
      const filteredOptions = q.options.filter((opt) => opt.trim() !== "");

      return {
        questionText: q.questionText,
        options: filteredOptions,
        correctAnswer: q.correctAnswer,
      };
    });

    // Validate processed questions
    for (const q of processedQuestions) {
      if (!q.questionText || q.options.length === 0 || !q.correctAnswer) {
        return res.status(400).json({
          message: "Each question must have text, options, and correct answer.",
        });
      }

      if (category === "Listening") {
        if (q.options.length !== 2 && q.options.length !== 4) {
          return res.status(400).json({
            message: "Listening questions must have either 2 or 4 options.",
          });
        }
      } else {
        if (q.options.length !== 4) {
          return res.status(400).json({
            message: "Non-Listening questions must have exactly 4 options.",
          });
        }
      }

      if (!q.options.includes(q.correctAnswer)) {
        return res.status(400).json({
          message: "Correct answer must be one of the provided options.",
        });
      }
    }

    // Save to database
    const newQuestionSet = new Question({
      passage: category === "Reading" ? passage : undefined,
      listeningFile: category === "Listening" ? req.file.filename : undefined,
      questions: processedQuestions,
      category,
      createdBy,
    });

    await newQuestionSet.save();

    res.status(201).json({
      message: "Question set added successfully!",
      newQuestionSet,
    });
  } catch (error) {
    console.error("Error saving question:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// Get questions by category
const getQuestionsByCategory = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "UserId is required." });
    }

    const questions = await Question.find({ createdBy: userId });

    if (questions.length === 0) {
      return res
        .status(404)
        .json({ message: "No questions found for this user." });
    }

    res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get all question
const getAllQuestions = async (req, res) => {
  try {
    // Fetch all questions from the database
    const questions = await Question.find();

    // Check if there are any questions
    if (!questions.length) {
      return res.status(404).json({ message: "No questions found." });
    }

    res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// Delete a question
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the question
    const deletedQuestion = await Question.findByIdAndDelete(id);

    if (!deletedQuestion) {
      return res.status(404).json({ message: "Question not found." });
    }

    res.status(200).json({ message: "Question deleted successfully!" });
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

module.exports = {
  addQuestion,
  getQuestionsByCategory,
  getAllQuestions,
  deleteQuestion,
};
