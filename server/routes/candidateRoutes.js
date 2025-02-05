const express = require('express');
const router = express.Router();
const testController= require("../controllers/Candidate/testController")

// Rout to get get the test by ID
router.get('/test-byid/:id',  testController.getTestById);
// Rout to submit candidate the questions
router.post('/tests/submit-exam', testController.submitQuestion);
// Route to get the assigned test for a candidate
router.get('/:candidateId/test', testController.getCandidateTest);


module.exports = router;