const Question = require("../../models/questions");

const addQuestion = async (req, res) => {
  try {
    const createdBy = req.params.userId;
    const { passage, questions: questionsStr, category } = req.body;

    if (!createdBy) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (
      !category ||
      !["Reading", "Listening", "Writing", "Grammar"].includes(category)
    ) {
      return res.status(400).json({ message: "Valid category is required" });
    }

    let questions;
    try {
      questions = JSON.parse(questionsStr);
    } catch (e) {
      return res.status(400).json({ message: "Invalid questions format" });
    }

    if (category === "Reading" && !passage) {
      return res
        .status(400)
        .json({ message: "Passage is required for Reading questions" });
    }

    if (category === "Listening" && !req.file) {
      return res
        .status(400)
        .json({ message: "Audio file is required for Listening questions" });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one question is required" });
    }

    const processedQuestions = [];

    for (const q of questions) {
      if (!q.questionText || !q.correctAnswer) {
        return res.status(400).json({
          message: "Each question must have text and correct answer",
        });
      }

      const filteredOptions = q.options
        ? q.options
            .filter((opt) => opt && opt.trim() !== "")
            .map((opt) => opt.trim())
        : [];

      if (category === "Listening") {
        if (filteredOptions.length !== 2 && filteredOptions.length !== 4) {
          return res.status(400).json({
            message: "Listening questions must have either 2 or 4 options",
          });
        }
      } else if (filteredOptions.length !== 4) {
        return res.status(400).json({
          message: "Non-Listening questions must have exactly 4 options",
        });
      }

      if (!filteredOptions.includes(q.correctAnswer.trim())) {
        return res.status(400).json({
          message: "Correct answer must be one of the provided options",
        });
      }

      processedQuestions.push({
        questionText: q.questionText.trim(),
        options: filteredOptions,
        correctAnswer: q.correctAnswer.trim(),
      });
    }

    const questionData = {
      questions: processedQuestions,
      category,
      createdBy,
      ...(category === "Reading" && { passage: passage.trim() }),
      ...(category === "Listening" && { listeningFile: req.file.filename }),
    };

    const newQuestionSet = new Question(questionData);
    await newQuestionSet.save();

    res.status(201).json({
      message: "Question set added successfully",
      data: newQuestionSet,
    });
  } catch (error) {
    console.error("Error saving question:", error);
    res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const getQuestionsByCategory = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const questions = await Question.find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .lean();

    if (!questions || questions.length === 0) {
      return res.status(404).json({
        message: "No questions found for this user",
        data: [],
      });
    }

    res.status(200).json({
      message: "Questions retrieved successfully",
      data: questions,
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 }).lean();

    if (!questions || questions.length === 0) {
      return res.status(404).json({
        message: "No questions found.",
        data: [],
      });
    }

    res.status(200).json({
      message: "Questions retrieved successfully",
      data: questions,
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const updateSingleQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { questionIndex, questionText, options, correctAnswer } = req.body;
    const userId = req.user.id;
    console.log(id)
    // Validate index
    if (!Number.isInteger(questionIndex)) {
      return res
        .status(400)
        .json({ message: "Valid question index is required" });
    }

    // Find the question set
    const questionSet = await Question.findById(id);
    if (!questionSet)
      return res.status(404).json({ message: "Question set not found" });

    // Ownership check
    if (questionSet.createdBy.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to edit this question" });
    }

    // Index range check
    if (questionIndex < 0 || questionIndex >= questionSet.questions.length) {
      return res.status(400).json({ message: "Question index out of range" });
    }

    // Validate fields
    if (
      !questionText ||
      !correctAnswer ||
      !Array.isArray(options) ||
      options.length === 0
    ) {
      return res
        .status(400)
        .json({
          message: "Question text, options, and correct answer are required",
        });
    }

    const cleanedOptions = options
      .map((opt) => opt.trim())
      .filter((opt) => opt !== "");

    if (!cleanedOptions.includes(correctAnswer.trim())) {
      return res
        .status(400)
        .json({ message: "Correct answer must be one of the options" });
    }

    // Update the question
    questionSet.questions[questionIndex] = {
      questionText: questionText.trim(),
      options: cleanedOptions,
      correctAnswer: correctAnswer.trim(),
    };

    await questionSet.save();

    res.status(200).json({
      message: "Question updated successfully",
      data: questionSet.questions[questionIndex],
    });
  } catch (error) {
    console.error("Error updating single question:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
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
  updateSingleQuestion,
};
