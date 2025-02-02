const express = require('express');
const router = express.Router();
const testController= require("../controllers/Admin/testController")
const lecturarController= require("../controllers/Admin/lecturarController");
const candidateController= require("../controllers/Admin/candidateController")
const settingController= require("../controllers/Admin/settingController");
const varifyUser = require('../middleware/varifyUser');




// Add a Tests
router.post('/add-test', varifyUser.verifyUser, testController.addTests);
// All Tests
router.get('/all-tests',  testController.getTests);
// get single test
router.get('/tests/:id', varifyUser.verifyUser, testController.getTestById);
// Edit a test
router.put('/tests/:id', varifyUser.verifyUser,  testController.updateTest);
// delete one test
router.delete("/tests/:id", varifyUser.verifyUser, testController.deleteTest);

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

// Settings
router.put('/settings', varifyUser.verifyUser, settingController.editSetting);


module.exports = router;
