const express = require('express');
const router = express.Router();

const settingLController= require("../controllers/Lecturer/settingLController");
const questionController= require("../controllers/Lecturer/questionController")

// singend in rout
router.post('/get-lecturer', settingLController.getLecturer);

router.post("/add-question", questionController.addQuestion);

router.get("/all-questions/:category", questionController.getQuestionsByCategory);



module.exports = router;