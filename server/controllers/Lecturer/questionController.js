
const Question = require("../../models/questions");

const addQuestion = async (req, res) => {
    try {
      const { question, options, correctAnswer, category } = req.body;
      // Ensure all required fields are provided
      if (!question || !Array.isArray(options) || options.length !== 4 || !correctAnswer) {
        return res.status(400).json({ message: "All fields are required and must contain exactly 4 options." });
      }
  
      // Ensure correctAnswer exists in the options array
      if (!options.includes(correctAnswer)) {
        return res.status(400).json({ message: "Correct answer must be one of the provided options." });
      }

      // Save the question
      const newQuestion = new Question({ question, options, correctAnswer, category });
      await newQuestion.save();
  
      res.status(201).json({ message: "Question added successfully!", newQuestion });
    } catch (error) {
      console.error("Error saving question:", error);
      res.status(500).json({ message: "Server Error", error });
    }
  };

  // Get questions by category
const getQuestionsByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        if (!category) {
            return res.status(400).json({ message: "Category is required." });
        }

        const questions = await Question.find({ category });

        if (questions.length === 0) {
            return res.status(404).json({ message: "No questions found for your category." });
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
  
  module.exports = { addQuestion, getQuestionsByCategory, getAllQuestions, deleteQuestion };