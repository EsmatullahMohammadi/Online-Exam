const Test = require('../../models/test');
const Question = require('../../models/questions');
const moment = require("moment-timezone");

// creating tests
const addTests = async (req, res) => {
  const { title, examDuration, numberOfQuestions, totalMarks, startDate, endDate, description,
    startTime, endTime, } = req.body;

    // Initializing date variables
    let startDateTime = null;
    let endDateTime = null;
    // Combining date and time only if both are provided
    if (startDate && startTime) {
      startDateTime = moment.tz(`${startDate} ${startTime}`, "YYYY-MM-DD HH:mm", "Asia/Kabul").toDate();
    } 
    if (endDate && endTime) {
      endDateTime = moment.tz(`${endDate} ${endTime}`, "YYYY-MM-DD HH:mm", "Asia/Kabul").toDate();
    }
  try {
    // Create a new test
    const newTest = new Test({
      title, examDuration, numberOfQuestions, totalMarks, startDate: startDateTime, endDate: endDateTime, description,
    });

    // Save test to the database
    await newTest.save();

    res.status(201).json({
      message: "Test added successfully!",
      test: newTest,
    });
  } catch (error) {
    console.error("Error adding test:", error.message);
    res.status(500).json({ message: "Failed to add test" });
  }
}
// getting all test
const getTests = async (req, res) => {
  try {
    // Retrieve all tests from the database
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
// Getting a single test by ID
const getTestById = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the test by ID
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

// Editing a test
const updateTest = async (req, res) => {
  const { id } = req.params;
  const { title, examDuration, numberOfQuestions, totalMarks, startDate, endDate, description } = req.body;

  try {
    // Find test by ID and update its fields
    const updatedTest = await Test.findByIdAndUpdate(
      id,
      { title, examDuration, numberOfQuestions, totalMarks, startDate, endDate, description },
      { new: true, runValidators: true } // Return updated document & validate fields
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
// Deleting a test by ID
const deleteTest = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the test by ID and delete it
    const deletedTest = await Test.findByIdAndDelete(id);

    if (!deletedTest) {
      return res.status(404).json({ message: "Test not found!" });
    }

    res.status(200).json({
      message: "Test deleted successfully!",
      test: deletedTest, // Optionally return the deleted test details
    });
  } catch (error) {
    console.error("Error deleting test:", error.message);
    res.status(500).json({ error: "Failed to delete test" });
  }
};

const assignedQuestion = async (req, res) => {
  try {
    const { testId, questionIds } = req.body;

    // Step 1: Validation
    if (!testId || !Array.isArray(questionIds) || questionIds.length === 0) {
      return res.status(400).json({
        message: "Test ID and a non-empty array of question IDs are required",
      });
    }

    // Step 2: Fetch the test
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    // Step 3: Flatten and verify all individual questions
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

    // Step 4: Ensure exact match
    if (allIndividualQuestions.length !== questionIds.length) {
      return res.status(400).json({
        message: "Some provided question IDs do not exist",
      });
    }

    // Step 5: Check if number matches required
    if (questionIds.length !== test.numberOfQuestions) {
      return res.status(400).json({
        message: `Exactly ${test.numberOfQuestions} questions must be assigned to this test`,
      });
    }

    // Step 6: Assign
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

    // Get all question sets that contain any of the test's question IDs
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

module.exports = { addTests, getTests, updateTest, getTestById, deleteTest, assignedQuestion, getDemoTestById }

