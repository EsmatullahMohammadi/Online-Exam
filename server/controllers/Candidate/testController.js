const Test = require("../../models/test");
const Question = require("../../models/questions");
const Candidate = require("../../models/candidate");
const CandidateResponse = require("../../models/CandidateResponse");
const moment = require("moment-timezone");

const getTestById = async (req, res) => {
  const { candidateId, testId } = req.params;

  try {
    // 1. Check if candidate has already submitted the test
    const submission = await CandidateResponse.findOne({ candidateId, testId });

    if (submission && submission.status !== "Pending") {
      return res.status(200).json({
        submitted: true,
        obtainedMarks: submission.obtainedMarks,
        status: submission.status,
        submittedAt: submission.submittedAt,
      });
    }

    // 2. Fetch the test (questions is array of subquestion _ids)
    const test = await Test.findById(testId);

    if (!test) {
      return res.status(404).json({ message: "Test not found!" });
    }

    const now = moment.tz("Asia/Kabul");
    const start = test.startDate
      ? moment.tz(test.startDate, "Asia/Kabul")
      : null;
    const end = test.endDate ? moment.tz(test.endDate, "Asia/Kabul") : null;

    if (start && now.isBefore(start)) {
      return res.status(403).json({
        message:
          "The exam has not started yet. Please check the scheduled time.",
      });
    }

    if (end && now.isAfter(end)) {
      return res.status(403).json({
        message: "The exam has ended. You can no longer access this test.",
      });
    }

    // 3. Find all Question documents where any sub-question _id is in test.questions array
    const questionGroups = await Question.find({
      "questions._id": { $in: test.questions },
    });

    // 4. For each question group, filter sub-questions that match the test.questions array
    const groupedQuestions = questionGroups.map((group) => {
      const includedQuestions = group.questions.filter((q) =>
        test.questions.some((id) => id.toString() === q._id.toString())
      );

      return {
        _id: group._id,
        category: group.category,
        passage: group.passage || null,
        listeningFile: group.listeningFile || null,
        questions: includedQuestions.map((q) => ({
          _id: q._id,
          questionText: q.questionText,
          options: q.options,
          // correctAnswer: q.correctAnswer, // optionally exclude
        })),
      };
    });

    res.status(200).json({
      message: "Test retrieved successfully!",
      submitted: false,
      test: {
        _id: test._id,
        title: test.title,
        examDuration: test.examDuration,
        totalMarks: test.totalMarks,
        numberOfQuestions: test.numberOfQuestions,
        description: test.description,
        questionGroups: groupedQuestions,
      },
    });
  } catch (error) {
    console.error("Error retrieving test:", error);
    res.status(500).json({ error: "Failed to retrieve test" });
  }
};

// submit the questions
const submitQuestion = async (req, res) => {
  try {
    const { testId, answers, candidateId } = req.body;

    // Check if candidate has already submitted the test
    const existingResponse = await CandidateResponse.findOne({
      testId,
      candidateId,
    });

    if (existingResponse && existingResponse.status !== "Pending") {
      return res.status(400).json({
        message:
          "You have already submitted this test. Submission is allowed only once.",
      });
    }

    // Find test
    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ message: "Test not found" });

    // Find candidate
    const candidate = await Candidate.findById(candidateId);
    if (!candidate)
      return res.status(404).json({ message: "Candidate not found" });

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

    // Update existing response (if available), or create new one
    await CandidateResponse.findOneAndUpdate(
      { testId, candidateId },
      {
        $set: {
          answers,
          score,
          obtainedMarks,
          status,
          submittedAt: new Date(),
        },
      },
      { upsert: true }
    );

    await candidate.save();

    res.json({
      message: "Test submitted successfully",
      obtainedMarks,
      status,
      passingMarks,
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
      return res.status(404).json({ message: "Candidate not found" });
    }
    if (!candidate.testId) {
      return res
        .status(404)
        .json({ message: "No test assigned to this candidate" });
    }
    res.status(200).json({ test: candidate.testId });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving test", error });
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
    res
      .status(500)
      .json({ message: "Error fetching submission status", error });
  }
};

const saveProgress = async (req, res) => {
  try {
    const { testId, candidateId, answers, currentPage } = req.body;

    // Find or create the candidate response
    let response = await CandidateResponse.findOneAndUpdate(
      { testId, candidateId },
      {
        $set: {
          answers,
          currentPage,
          lastSaved: new Date(),
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Progress saved successfully",
      currentPage: response.currentPage,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error saving progress",
      error: error.message,
    });
  }
};

// New function to get saved progress
const getProgress = async (req, res) => {
  try {
    const { testId, candidateId } = req.params;

    const response = await CandidateResponse.findOne({
      testId,
      candidateId,
    });
    if (!response) {
      return res.status(200).json({
        answers: {},
        currentPage: 1,
        submitted: false,
      });
    }

    res.status(200).json({
      answers: response.answers || {},
      currentPage: response.currentPage || 1,
      submitted: response.status !== "Pending",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching progress",
      error: error.message,
    });
  }
};

module.exports = {
  getTestById,
  submitQuestion,
  getCandidateTest,
  getResult,
  saveProgress,
  getProgress,
};
