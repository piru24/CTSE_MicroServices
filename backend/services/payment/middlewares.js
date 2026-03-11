const jwt = require('jsonwebtoken'); // <-- Add this line

// Authentication middleware
const requireAuth = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(403).json({ message: "Login required!" });
    }
    const decoded = jwt.verify(token, process.env.SECRET);
    req.userId = decoded._id;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};

const requireRoleSeller = (req, res, next) => {
  if (req.userRole === "seller") {
    next();
  } else {
    res.status(403).json({ message: 'Unauthorized' });
  }
};

const requireRoleAdmin = (req, res, next) => {
  if (req.userRole === "admin") {
    next();
  } else {
    res.status(403).json({ message: 'Unauthorized' });
  }
};

const requireRoleBuyer = (req, res, next) => {
  if (req.userRole === "buyer") {
    next();
  } else {
    res.status(403).json({ message: 'Unauthorized' });
  }
};

// delivery person
const requireRoleDelivery = (req, res, next) => {
  if (req.userRole === "delivery") {
    next();
  } else {
    res.status(403).json({ message: 'Unauthorized' });
  }
};

exports.requireAuth = requireAuth;
exports.requireRoleSeller = requireRoleSeller;
exports.requireRoleAdmin = requireRoleAdmin;
exports.requireRoleBuyer = requireRoleBuyer;
exports.requireRoleDelivery = requireRoleDelivery;
