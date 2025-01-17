const express = require('express');
const router = express.Router();

const settingLController= require("../controllers/Lecturer/settingLController");

// singend in rout
router.post('/get-lecturer', settingLController.getLecturer);

module.exports = router;