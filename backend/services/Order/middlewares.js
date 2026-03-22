const jwt = require("jsonwebtoken");

const getJwtSecret = () => process.env.JWT_SECRET || process.env.SECRET;

// ===============================
// AUTHENTICATION MIDDLEWARE
// ===============================
const requireAuth = (req, res, next) => {
  try {
    const jwtSecret = getJwtSecret();

    if (!jwtSecret) {
      return res.status(500).json({
        message: "Auth misconfiguration"
      });
    }

    let token;

    // 1️⃣ Check Authorization header
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2️⃣ If not found, check cookies
    if (!token && req.cookies) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        message: "Login required"
      });
    }

    // Verify token
    const decoded = jwt.verify(token, jwtSecret);

    // Attach user data
    req.userId = decoded._id;
    req.userRole = decoded.role;

    return next();

  } catch (err) {
    console.error("JWT verification failed:", err.message);

    return res.status(401).json({
      message: "Invalid token"
    });
  }
};


// ===============================
// GENERIC ROLE CHECKER
// ===============================
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {

    if (!req.userRole) {
      return res.status(403).json({
        message: "Role information missing"
      });
    }

    if (allowedRoles.includes(req.userRole)) {
      return next();
    }

    return res.status(403).json({
      message: "Forbidden"
    });
  };
};


// ===============================
// SPECIFIC ROLE HELPERS
// ===============================
const requireRoleSeller = (req, res, next) => {
  return requireRole("seller")(req, res, next);
};

const requireRoleAdmin = (req, res, next) => {
  return requireRole("admin")(req, res, next);
};

const requireRoleBuyer = (req, res, next) => {
  return requireRole("buyer")(req, res, next);
};

const requireRoleDelivery = (req, res, next) => {
  return requireRole("delivery")(req, res, next);
};


// ===============================
// EXPORTS
// ===============================
module.exports = {
  requireAuth,
  requireRole,
  requireRoleSeller,
  requireRoleAdmin,
  requireRoleBuyer,
  requireRoleDelivery
};