const express = require('express');
const router = express.Router();
const testController= require("../controllers/Admin/testController")
const lecturarController= require("../controllers/Admin/lecturarController");
const candidateController= require("../controllers/Admin/candidateController")
const settingController= require("../controllers/Admin/settingController");
const verifyUser = require('../middleware/varifyUser');




// Add a Tests
router.post('/add-test', verifyUser, testController.addTests);
// All Tests
router.get('/all-tests', verifyUser, testController.getTests);
// get single test
router.get('/tests/:id', verifyUser, testController.getTestById);
// Edit a test
router.put('/tests/:id', verifyUser,  testController.updateTest);
// delete one test
router.delete("/tests/:id", verifyUser, testController.deleteTest);

// Add a lecturar
router.post('/add-lecturar', verifyUser, lecturarController.addLecturar);
// All lecturar
router.get('/all-lecturars', verifyUser, lecturarController.getLecturar);
// delete one lecturer
router.delete("/lecturars/:id", verifyUser, lecturarController.deleteLecturer);

// Add a candidates
router.post('/add-candidates', verifyUser, candidateController.addCandidate);
// All candidates
router.get('/all-candidates', verifyUser, candidateController.getCandidates);

// Settings
router.put('/settings', verifyUser, settingController.editSetting);


module.exports = router;
