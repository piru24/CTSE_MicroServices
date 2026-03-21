const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  try {

    let token = null;

    // Read Authorization header
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "No token provided"
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET);

    req.userId = decoded._id;
    req.userRole = decoded.role;

    next();

  } catch (error) {

    console.log("JWT Error:", error);

    return res.status(401).json({
      message: "Invalid token"
    });

  }
};

module.exports = { requireAuth };