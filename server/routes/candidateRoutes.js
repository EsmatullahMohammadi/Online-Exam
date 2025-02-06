const express = require('express');
const router = express.Router();
const testController= require("../controllers/Candidate/testController");
const settingCController= require("../controllers/Candidate/settingCController");
const { verifyCandidate } = require('../middleware/varifyUser');

// Rout to get get the test by ID
router.get('/test-byid/:testId/:candidateId', verifyCandidate, testController.getTestById);
// Rout to submit candidate the questions
router.post('/tests/submit-exam', verifyCandidate, testController.submitQuestion);
// Route to get the assigned test for a candidate
router.get('/:candidateId/test', verifyCandidate, testController.getCandidateTest);
// route for get the result
router.get("/candidate/:candidateId/submission/:testId", verifyCandidate, testController.getResult);

// get lecturer for setting in the frontend
router.put('/candidate-settings/:candidateId', verifyCandidate, settingCController.editCandidate);


module.exports = router;