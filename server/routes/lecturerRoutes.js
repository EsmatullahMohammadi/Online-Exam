const express = require('express');
const multer = require("multer");
const path = require("path");

const router = express.Router();

const settingLController= require("../controllers/Lecturer/settingLController");
const questionController= require("../controllers/Lecturer/questionController");
const { verifyLecturer } = require('../middleware/varifyUser');

// Multer Storage Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "listening/"); // Save files in the 'listening' folder
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
  });
  
const upload = multer({ storage });


// singend in rout
// router.post('/get-lecturer', settingLController.getLecturer);

// adding question
router.post("/add-question/:userId", verifyLecturer, upload.single("listeningFile"), questionController.addQuestion);
// get questions by the category
router.get("/all-questions/:userId", verifyLecturer, questionController.getQuestionsByCategory);

// get lecturer for setting in the frontend
router.put('/settings/:lecturerId', verifyLecturer, settingLController.editLecturer);





module.exports = router;