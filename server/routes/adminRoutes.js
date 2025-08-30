const express = require('express');
const router = express.Router();
const testController= require("../controllers/Admin/testController")
const lecturarController= require("../controllers/Admin/lecturarController");
const candidateController= require("../controllers/Admin/candidateController")
const settingController= require("../controllers/Admin/settingController");
const questionController= require("../controllers/Lecturer/questionController");
const resultController= require("../controllers/Admin/resultController");
const varifyUser = require('../middleware/varifyUser');

// Add a Tests
router.post('/add-test', varifyUser.verifyUser, testController.addTests);
// get All Tests
router.get('/all-tests', varifyUser.verifyUser, testController.getTests);
// get single test
router.get('/tests/:id', varifyUser.verifyUser, testController.getTestById);
// Edit a test
router.put('/tests/:id', varifyUser.verifyUser,  testController.updateTest);
// delete one test
router.delete("/tests/:id", varifyUser.verifyUser, testController.deleteTest);
// get demo test
router.get('/demo-test-byid/:testId', varifyUser.verifyUser, testController.getDemoTestById);

// Add a lecturar
router.post('/add-lecturar', varifyUser.verifyUser, lecturarController.addLecturar);
// All lecturar
router.get('/all-lecturars', varifyUser.verifyUser, lecturarController.getLecturar);
// delete one lecturer
router.delete("/lecturars/:id", varifyUser.verifyUser, lecturarController.deleteLecturer);

// Add a candidates
router.post('/add-candidates', varifyUser.verifyUser, candidateController.addCandidate);
// All candidates
router.get('/all-candidates', varifyUser.verifyUser, candidateController.getCandidates);
router.get("/candidates-by-test", varifyUser.verifyUser, candidateController.getCandidatesByTest);
// Edit a candidate
router.put('/update-candidate/:id', varifyUser.verifyUser,  candidateController.updateCandidate);
// delete one candidate
router.delete("/candidates/:id", varifyUser.verifyUser, candidateController.deleteCondidate);

// Get all question
router.get('/questions', varifyUser.verifyUser, questionController.getAllQuestions)
// Delete 
router.delete('/questions/:id', varifyUser.verifyUser, questionController.deleteQuestion);
// assign-questions rout
router.post('/assign-questions', varifyUser.verifyUser, testController.assignedQuestion)

// Result routs 
router.get('/results', varifyUser.verifyUser, resultController.getResults);

// Settings
router.put('/settings', varifyUser.verifyUser, settingController.editSetting);
// update image with role and id in all role
router.put("/update-image/:role/:id", settingController.upload.single("profileImage"), settingController.editAdminImage);
// get the image of a user by the id and role 
router.get('/get-image/:role/:id',  settingController.getImage);


module.exports = router;
