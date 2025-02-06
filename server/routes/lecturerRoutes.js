const express = require('express');
const router = express.Router();

const settingLController= require("../controllers/Lecturer/settingLController");
const questionController= require("../controllers/Lecturer/questionController");
const { verifyLecturer } = require('../middleware/varifyUser');

// singend in rout
// router.post('/get-lecturer', settingLController.getLecturer);

// adding question
router.post("/add-question", verifyLecturer, questionController.addQuestion);
// get questions by the category
router.get("/all-questions/:category", verifyLecturer, questionController.getQuestionsByCategory);

// get lecturer for setting in the frontend
router.put('/settings/:lecturerId', verifyLecturer, settingLController.editLecturer);





module.exports = router;