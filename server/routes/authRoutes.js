const express = require('express');
const router = express.Router();

const authContoller= require("../controllers/Auth/authContoller");
const varifyUser = require('../middleware/varifyUser');

router.post('/login', authContoller.auth);

router.post('/forgot-password', authContoller.forgotPassword);

router.get("/verify-token", varifyUser.verifyUser, (req, res) => {
  res.status(200).json({
    status: true,
    message: "User is authenticated",
    user: req.user,
  });
});

router.get("/verify-lcturer-token", varifyUser.verifyLecturer, (req, res) => {
  res.status(200).json({
    status: true,
    message: "User is authenticated",
    user: req.user, 
  });
});

router.get("/verify-candidate-token", varifyUser.verifyCandidate, (req, res) => {
  res.status(200).json({
    status: true,
    message: "User is authenticated",
    user: req.user, 
  });
});

router.get("/logout-admin", varifyUser.verifyUser, (req, res) => {
  res.clearCookie('token');
  res.status(200).json({
    status: true,
  });
});

router.get("/logout-lecturer", varifyUser.verifyLecturer, (req, res) => {
  res.clearCookie('lecturerToken');
  res.status(200).json({
    status: true,
  });
});

router.get("/logout-candidate", varifyUser.verifyCandidate, (req, res) => {
  res.clearCookie('candidateToken');
  res.status(200).json({
    status: true,
  });
});
  

module.exports = router;