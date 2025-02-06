const Test = require('../../models/test');
const Question= require('../../models/questions');
const Candidate = require('../../models/candidate');
const CandidateResponse= require('../../models/CandidateResponse')

const getTestById = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Find the test by ID
      const test = await Test.findById(id).populate("questions");
  
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
// Submit Question
const submitQuestion = async (req, res) =>{
    try {
        const { testId, answers, candidateId } = req.body;
        
        const test = await Test.findById(testId);
        if (!test) return res.status(404).json({ message: "Test not found" });
    
        const questions = await Question.find({ _id: { $in: test.questions } });
    
        let score = 0;
        questions.forEach((question) => {
          if (answers[question._id] === question.correctAnswer) {
            score += 1;
          }
        });
    
        const candidateResponse = new CandidateResponse({
          testId,
          candidateId,
          answers,
          score,
        });
    
        await candidateResponse.save();
        res.json({ message: "Test submitted successfully", score });
      } catch (error) {
        res.status(500).json({ message: "Error submitting test", error });
      }
}
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

module.exports= {getTestById, submitQuestion, getCandidateTest}
