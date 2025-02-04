const JWT = require("jsonwebtoken");

const verifyUser = async (req, res, next) => {
  
    try {
      // Ensure you're using the correct cookie parser middleware
      const token = req.cookies.token;  
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

const verifyLecturer = async (req, res, next) => {
  
  try {
    // Ensure you're using the correct cookie parser middleware
    const { lecturerToken } = req.cookies;  
    if (!lecturerToken) {
      return res.status(401).json({
        status: false,
        message: "No lecturerToken provided. Unauthorized access.",
      });
    }
    // Synchronously verify the lecturerToken
    const decoded = await JWT.verify(lecturerToken, process.env.TOKEN_KEY);

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error verifying lecturerToken:", error.message);
    res.status(401).json({
      status: false,
      message: "Invalid or expired lecturerToken. Unauthorized access.",
      error: error.message,
    });
  }
};

const verifyCandidate = async (req, res, next) => {
  
  try {
    // Ensure you're using the correct cookie parser middleware
    const { candidateToken } = req.cookies;  
    if (!candidateToken) {
      return res.status(401).json({
        status: false,
        message: "No candidateToken provided. Unauthorized access.",
      });
    }
    // Synchronously verify the candidateToken
    const decoded = await JWT.verify(candidateToken, process.env.TOKEN_KEY);

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error verifying candidateToken:", error.message);
    res.status(401).json({
      status: false,
      message: "Invalid or expired candidateToken. Unauthorized access.",
      error: error.message,
    });
  }
};

module.exports = { verifyUser, verifyLecturer, verifyCandidate };
