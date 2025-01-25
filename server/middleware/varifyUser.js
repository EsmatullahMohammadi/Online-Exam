const JWT = require("jsonwebtoken");

const verifyUser = async (req, res, next) => {

    try {
      // Ensure you're using the correct cookie parser middleware
      const { token } = req.cookies;
      
      if (!token) {
        return res.status(401).json({
          status: false,
          message: "No token provided. Unauthorized access.",
        });
      }

      // Synchronously verify the token
      const decoded = await JWT.verify(token, process.env.TOKEN_KEY);

      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      console.error("Error verifying token:", error.message);
      res.status(401).json({
        status: false,
        message: "Invalid or expired token. Unauthorized access.",
        error: error.message,
      });
    }
};

module.exports = verifyUser;
