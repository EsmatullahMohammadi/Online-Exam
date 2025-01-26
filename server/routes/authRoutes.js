const express = require('express');
const router = express.Router();

const authContoller= require("../controllers/Auth/authContoller");
const verifyUser = require('../middleware/varifyUser');

// singend in rout
router.post('/login', authContoller.auth);
// forgot password rout
router.post('/forgot-password', authContoller.forgotPassword);

router.get("/verify-token", verifyUser, (req, res) => {
  res.status(200).json({
    status: true,
    message: "User is authenticated",
    user: req.user, // Assuming `verifyUser` middleware attaches the user to `req`
  });
});
// logout functionality
router.get("/logout", (req, res) => {
  res.clearCookie('token');
  res.status(200).json({
    status: true,
  });
});

  

module.exports = router;