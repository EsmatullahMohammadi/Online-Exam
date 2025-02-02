const express = require('express');
const router = express.Router();

const settingLController= require("../controllers/Lecturer/settingLController");
const questionController= require("../controllers/Lecturer/questionController")

// singend in rout
router.post('/get-lecturer', settingLController.getLecturer);

// adding question
router.post("/add-question", questionController.addQuestion);
// get questions by the category
router.get("/all-questions/:category", questionController.getQuestionsByCategory);

// get lecturer for setting in the frontend
router.put('/settings/:lecturerId',  settingLController.editLecturer);





module.exports = router;