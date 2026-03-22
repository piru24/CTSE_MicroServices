const jwt = require('jsonwebtoken');

// Authentication middleware
const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({ message: "Login required!" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.SECRET);

    req.userId = decoded._id;
    req.userRole = decoded.role;

    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Role-based middleware
const requireRoleSeller = (req, res, next) => {
  if (req.userRole === "seller") {
    return next();
  }
  return res.status(403).json({ message: "Unauthorized" });
};

const requireRoleAdmin = (req, res, next) => {
  if (req.userRole === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Unauthorized" });
};

const requireRoleBuyer = (req, res, next) => {
  if (req.userRole === "buyer") {
    return next();
  }
  return res.status(403).json({ message: "Unauthorized" });
};

const requireRoleBuyerOrSeller = (req, res, next) => {
  if (
  req.userRole?.toLowerCase() === "buyer" ||
  req.userRole?.toLowerCase() === "seller"
) {
    return next();
  }
  return res.status(403).json({ message: "Unauthorized" });
};

// delivery person
const requireRoleDelivery = (req, res, next) => {
  if (req.userRole === "delivery") {
    next();
  } else {
    res.status(403).json({ message: 'Unauthorized' });
  }
};

module.exports = {
  requireAuth,
  requireRoleSeller,
  requireRoleAdmin,
  requireRoleBuyer,
  requireRoleBuyerOrSeller
};
exports.requireRoleDelivery = requireRoleDelivery;
