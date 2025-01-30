const express = require('express');
const router = express.Router();

const authContoller= require("../controllers/Auth/authContoller");
const varifyUser = require('../middleware/varifyUser');

// singend in rout
router.post('/login', authContoller.auth);
// forgot password rout
router.post('/forgot-password', authContoller.forgotPassword);

router.get("/verify-token", varifyUser.verifyUser, (req, res) => {
  res.status(200).json({
    status: true,
    message: "User is authenticated",
    user: req.user, // Assuming `verifyUser` middleware attaches the user to `req`
  });
});
router.get("/verify-lcturer-token", varifyUser.verifyLecturer, (req, res) => {
  res.status(200).json({
    status: true,
    message: "User is authenticated",
    user: req.user, // Assuming `verifyUser` middleware attaches the user to `req`
  });
});
// logout functionality
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
  

module.exports = router;