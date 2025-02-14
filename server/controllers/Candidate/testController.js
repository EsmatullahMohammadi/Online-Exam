const Test = require('../../models/test');
const Question = require('../../models/questions');
const Candidate = require('../../models/candidate');
const CandidateResponse = require('../../models/CandidateResponse')
const moment = require("moment-timezone");

const getTestById = async (req, res) => {
  const { candidateId, testId } = req.params;
  try {
    // Find the test by ID
    const submission = await CandidateResponse.findOne({ candidateId, testId });
    if (submission) {
      return res.status(200).json({
        submitted: true,
        obtainedMarks: submission.obtainedMarks,
        status: submission.status,
        submittedAt: submission.submittedAt,
      });
    }
    const test = await Test.findById(testId).populate("questions");
    if (!test) {
      return res.status(404).json({ message: "Test not found!" });
    }

    if (test.startDate && test.endDate) {
      // Set timezone to Asia/Kabul explicitly
      const now = moment.tz("Asia/Kabul");
      const start = moment.tz(test.startDate, "Asia/Kabul");
      const end = moment.tz(test.endDate, "Asia/Kabul");
    
      console.log("Start:", start.format("M/D/YYYY, h:mm:ss A"));
      console.log("End:", end.format("M/D/YYYY, h:mm:ss A"));
      console.log("Now:", now.format("M/D/YYYY, h:mm:ss A"));
    
      if (now.isBefore(start)) {
        return res.status(403).json({ 
          message: "The exam has not started yet. Please check the scheduled time." 
        });
      }
    
      if (now.isAfter(end)) {
        return res.status(403).json({ 
          message: "The exam has ended. You can no longer access this test." 
        });
      }
    }

    res.status(200).json({
      message: "Test retrieved successfully!",
      submitted: false,
      test,
      questions: test.questions
    });
  } catch (error) {
    console.error("Error retrieving test:", error.message);
    res.status(500).json({ error: "Failed to retrieve test" });
  }
};
// submit the questions
const submitQuestion = async (req, res) => {
  try {
    const { testId, answers, candidateId } = req.body;

    // Check if candidate has already submitted the test
    const existingResponse = await CandidateResponse.findOne({ testId, candidateId });
    if (existingResponse) {
      return res.status(400).json({ message: "You have already submitted this test. Submission is allowed only once." });
    }

    // Find test
    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ message: "Test not found" });

    // Find candidate
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) return res.status(404).json({ message: "Candidate not found" });

    // Find questions
    const questions = await Question.find({ _id: { $in: test.questions } });

    // Calculate score
    let score = 0;
    questions.forEach((question) => {
      if (answers[question._id] === question.correctAnswer) {
        score += 1;
      }
    });

    // Calculate obtained marks
    const totalMarks = test.totalMarks;
    const obtainedMarks = (score / questions.length) * totalMarks;

    // Determine pass percentage
    const passPercentage = candidate.educationDegree === "Master" ? 65 : 60;
    const passingMarks = (passPercentage / 100) * totalMarks;

    // Determine pass/fail status
    const status = obtainedMarks >= passingMarks ? "Passed" : "Failed";
    candidate.status = status;

    // Save candidate response
    const candidateResponse = new CandidateResponse({
      testId,
      candidateId,
      answers,
      score,
      obtainedMarks,
      status,
    });

    await candidateResponse.save();
    await candidate.save();

    res.json({
      message: "Test submitted successfully",
      obtainedMarks,
      status,
      passingMarks
    });

  } catch (error) {
    res.status(500).json({ message: "Error submitting test", error });
  }
};
// Get assigned test for a candidate
const getCandidateTest = async (req, res) => {
  try {
    const { candidateId } = req.params;

    // Find candidate
    const candidate = await Candidate.findById(candidateId).populate("testId");
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    if (!candidate.testId) {
      return res.status(404).json({ message: "No test assigned to this candidate" });
    }
    res.status(200).json({ test: candidate.testId });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving test', error });
  }
};
// Get the result
const getResult = async (req, res) => {
  try {
    const { candidateId, testId } = req.params;

    const submission = await CandidateResponse.findOne({ candidateId, testId });
    if (submission) {
      return res.json({
        submitted: true,
        obtainedMarks: submission.obtainedMarks,
        status: submission.status,
        submittedAt: submission.submittedAt,
      });
    } else {
      return res.json({ submitted: false });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching submission status", error });
  }
}

module.exports = { getTestById, submitQuestion, getCandidateTest, getResult }
