const jwt = require('jsonwebtoken');

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

// Generic role checker that accepts multiple roles
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.userRole) {
      return res.status(403).json({ message: 'Role information missing' });
    }
    
    if (allowedRoles.includes(req.userRole)) {
      return next();
    }
    
    res.status(403).json({ message: 'Unauthorized - Insufficient permissions' });
  };
};

// Specific role checkers (kept for backward compatibility)
const requireRoleSeller = (req, res, next) => requireRole('seller')(req, res, next);
const requireRoleAdmin = (req, res, next) => requireRole('admin')(req, res, next);
const requireRoleBuyer = (req, res, next) => requireRole('buyer')(req, res, next);
const requireRoleDelivery = (req, res, next) => requireRole('delivery')(req, res, next);

module.exports = {
  requireAuth,
  requireRole, // The new flexible role checker
  requireRoleSeller,
  requireRoleAdmin,
  requireRoleBuyer,
  requireRoleDelivery
};