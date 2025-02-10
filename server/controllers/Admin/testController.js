const Test = require('../../models/test');
const Question= require('../../models/questions');

// creating tests
const addTests= async (req,res)=>{
    const { title, examDuration, numberOfQuestions, totalMarks, startDate, endDate, description,
      } = req.body;
    
      try {
        // Create a new test
        const newTest = new Test({ title, examDuration, numberOfQuestions, totalMarks, startDate, endDate, description,
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
      const tests = await Test.find().sort({createdAt: -1});
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
// Assign questions to a test
const assignedQuestion = async (req, res) =>{
  try {
    const { testId, questionIds } = req.body;

    if (!testId || !Array.isArray(questionIds)) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    // Validate test existence
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    // Validate if all question IDs exist
    const validQuestions = await Question.find({ _id: { $in: questionIds } });
    if (validQuestions.length !== questionIds.length) {
      return res.status(400).json({ message: "Some questions do not exist" });
    }

    // Ensure the assigned questions are exactly equal to numberOfQuestions
    const requiredQuestions = test.numberOfQuestions;
    if (questionIds.length !== requiredQuestions) {
      return res.status(400).json({
        message: `You must assign exactly ${requiredQuestions} questions to this test.`,
      });
    }

    // Assign selected questions to the test
    test.questions = questionIds;
    await test.save();

    res.status(200).json({
      message: "Questions assigned successfully!",
      test,
    });
  } catch (error) {
    console.error("Error assigning questions:", error);
    res.status(500).json({ message: "Server error" });
  }
}
// get demo test 
const getDemoTestById = async (req, res) => {
  const { testId } = req.params;  
  try {  
    const test = await Test.findById(testId).populate("questions");
    if (!test) {
      return res.status(404).json({ message: "Test not found!" });
    }
    res.status(200).json({
      message: "Test retrieved successfully!",
      test,
      questions: test.questions
    });
  } catch (error) {
    console.error("Error retrieving test:", error.message);
    res.status(500).json({ error: "Failed to retrieve test" });
  }
};
module.exports= {addTests, getTests, updateTest, getTestById, deleteTest, assignedQuestion, getDemoTestById}

