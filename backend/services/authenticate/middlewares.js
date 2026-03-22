const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {

  let token = null;

  // 1️⃣ Check cookie
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // 2️⃣ Check Authorization header
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    return res.status(401).json({
      message: "Authentication required. Please log in."
    });
  }

  jwt.verify(token, process.env.SECRET, (err, decodedToken) => {

    if (err) {
      return res.status(403).json({
        message: "Invalid or expired token."
      });
    }

    req.userId = decodedToken._id;

    // 🔥 FIX: normalize role here
    req.userRole = decodedToken.role?.toLowerCase();

    // 🔍 DEBUG (IMPORTANT)
    console.log("ROLE FROM TOKEN:", req.userRole);

    next();
  });
};


// 🔥 ALSO FIX ROLE CHECKS (safe version)

const requireRoleSeller = (req, res, next) => {
  if (req.userRole === "seller") {
    return next();
  }
  return res.status(403).json({ message: "Unauthorized - Seller only" });
};

const requireRoleAdmin = (req, res, next) => {
  if (req.userRole === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Unauthorized - Admin only" });
};

const requireRoleBuyer = (req, res, next) => {
  if (req.userRole === "buyer") {
    return next();
  }
  return res.status(403).json({ message: "Unauthorized - Buyer only" });
};

// 🔥 ADD THIS (you were missing it)
const requireRoleBuyerOrSeller = (req, res, next) => {
  if (req.userRole === "buyer" || req.userRole === "seller") {
    return next();
  }
  return res.status(403).json({ message: "Unauthorized - Buyer or Seller only" });
};

const requireRoleDelivery = (req, res, next) => {
  if (req.userRole === "delivery") {
    return next();
  }
  return res.status(403).json({ message: "Unauthorized - Delivery only" });
};


exports.requireAuth = requireAuth;
exports.requireRoleSeller = requireRoleSeller;
exports.requireRoleAdmin = requireRoleAdmin;
exports.requireRoleBuyer = requireRoleBuyer;
exports.requireRoleBuyerOrSeller = requireRoleBuyerOrSeller; // 🔥 IMPORTANT
exports.requireRoleDelivery = requireRoleDelivery;