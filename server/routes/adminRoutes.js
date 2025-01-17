const express = require('express');
const router = express.Router();
const testController= require("../controllers/Admin/testController")
const lecturarController= require("../controllers/Admin/lecturarController");
const candidateController= require("../controllers/Admin/candidateController")
const settingController= require("../controllers/Admin/settingController")


// Add a Tests
router.post('/add-test', testController.addTests);
// All Tests
router.get('/all-tests', testController.getTests);
// get single test
router.get('/tests/:id', testController.getTestById);
// Edit a test
router.put('/tests/:id', testController.updateTest);
// delete one test
router.delete("/tests/:id", testController.deleteTest);

// Add a lecturar
router.post('/add-lecturar', lecturarController.addLecturar);
// All lecturar
router.get('/all-lecturars', lecturarController.getLecturar);
// delete one lecturer
router.delete("/lecturars/:id", lecturarController.deleteLecturer);

// Add a candidates
router.post('/add-candidates', candidateController.addCandidate);
// All candidates
router.get('/all-candidates', candidateController.getCandidates);

// Settings
router.put('/settings', settingController.editSetting);
// singend in rout
router.post('/get-admin', settingController.getSetting);

module.exports = router;
