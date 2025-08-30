const Test = require("../../models/test");
const Question = require("../../models/questions");
const moment = require("moment-timezone");

const addTests = async (req, res) => {
  const {
    title,
    examDuration,
    numberOfQuestions,
    totalMarks,
    startDate,
    endDate,
    description,
    startTime,
    endTime,
  } = req.body;

  let startDateTime = null;
  let endDateTime = null;
  if (startDate && startTime) {
    startDateTime = moment
      .tz(`${startDate} ${startTime}`, "YYYY-MM-DD HH:mm", "Asia/Kabul")
      .toDate();
  }
  if (endDate && endTime) {
    endDateTime = moment
      .tz(`${endDate} ${endTime}`, "YYYY-MM-DD HH:mm", "Asia/Kabul")
      .toDate();
  }
  try {
    const newTest = new Test({
      title,
      examDuration,
      numberOfQuestions,
      totalMarks,
      startDate: startDateTime,
      endDate: endDateTime,
      description,
    });

    await newTest.save();

    res.status(201).json({
      message: "Test added successfully!",
      test: newTest,
    });
  } catch (error) {
    console.error("Error adding test:", error.message);
    res.status(500).json({ message: "Failed to add test" });
  }
};

const getTests = async (req, res) => {
  try {
    const tests = await Test.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "Tests retrieved successfully!",
      tests,
    });
  } catch (error) {
    console.error("Error retrieving tests:", error.message);
    res.status(500).json({ error: "Failed to retrieve tests" });
  }
};

const getTestById = async (req, res) => {
  const { id } = req.params;

  try {
    const test = await Test.findById(id);

    if (!test) {
      return res.status(404).json({ message: "Test not found!" });
    }

    res.status(200).json({
      message: "Test retrieved successfully!",
      test,
    });
  } catch (error) {
    console.error("Error retrieving test:", error.message);
    res.status(500).json({ error: "Failed to retrieve test" });
  }
};

const updateTest = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    examDuration,
    numberOfQuestions,
    totalMarks,
    startDate,
    endDate,
    description,
  } = req.body;

  try {
    const updateData = {
      title,
      examDuration,
      numberOfQuestions,
      totalMarks,
      description,
    };

    if (startDate) updateData.startDate = startDate;
    if (endDate) updateData.endDate = endDate;

    const updatedTest = await Test.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedTest) {
      return res.status(404).json({ message: "Test not found!" });
    }

    res.status(200).json({
      message: "Test updated successfully!",
      test: updatedTest,
    });
  } catch (error) {
    console.error("Error updating test:", error.message);
    res.status(500).json({ error: "Failed to update test" });
  }
};

const deleteTest = async (req, res) => {
  const { id } = req.params;

  try {
    const test = await Test.findById(id);

    if (!test) {
      return res.status(404).json({ message: "Test not found!" });
    }

    if (test.candidates && test.candidates.length > 0) {
      return res.status(400).json({
        message: "Cannot delete test. Candidates are already assigned.",
      });
    }

    const deletedTest = await Test.findByIdAndDelete(id);

    res.status(200).json({
      message: "Test deleted successfully!",
      test: deletedTest,
    });
  } catch (error) {
    console.error("Error deleting test:", error.message);
    res.status(500).json({ error: "Failed to delete test" });
  }
};

const assignedQuestion = async (req, res) => {
  try {
    const { testId, questionIds } = req.body;

    if (!testId || !Array.isArray(questionIds) || questionIds.length === 0) {
      return res.status(400).json({
        message: "Test ID and a non-empty array of question IDs are required",
      });
    }

    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    const matchedQuestionSets = await Question.find({
      "questions._id": { $in: questionIds },
    });

    const allIndividualQuestions = [];
    matchedQuestionSets.forEach((set) => {
      set.questions.forEach((q) => {
        if (questionIds.includes(q._id.toString())) {
          allIndividualQuestions.push(q._id.toString());
        }
      });
    });

    if (allIndividualQuestions.length !== questionIds.length) {
      return res.status(400).json({
        message: "Some provided question IDs do not exist",
      });
    }

    if (questionIds.length !== test.numberOfQuestions) {
      return res.status(400).json({
        message: `Exactly ${test.numberOfQuestions} questions must be assigned to this test`,
      });
    }

    test.questions = questionIds;
    await test.save();

    return res.status(200).json({
      message: "Questions assigned successfully",
      data: test,
    });
  } catch (error) {
    console.error("Error assigning questions:", error);
    res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const getDemoTestById = async (req, res) => {
  const { testId } = req.params;

  try {
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ message: "Test not found!" });
    }

    const questionSets = await Question.find({
      "questions._id": { $in: test.questions },
    });

    const groupedQuestions = [];

    for (const set of questionSets) {
      const includedQuestions = set.questions.filter((q) =>
        test.questions.includes(q._id.toString())
      );

      if (includedQuestions.length > 0) {
        groupedQuestions.push({
          _id: set._id,
          category: set.category,
          passage: set.passage || null,
          listeningFile: set.listeningFile || null,
          questions: includedQuestions,
        });
      }
    }

    res.status(200).json({
      message: "Test retrieved successfully!",
      test,
      groupedQuestions,
    });
  } catch (error) {
    console.error("Error retrieving test:", error.message);
    res.status(500).json({ error: "Failed to retrieve test" });
  }
};

module.exports = {
  addTests,
  getTests,
  updateTest,
  getTestById,
  deleteTest,
  assignedQuestion,
  getDemoTestById,
};
