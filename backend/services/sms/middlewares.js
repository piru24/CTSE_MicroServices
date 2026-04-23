const jwt = require("jsonwebtoken");

// Authentication middleware
const requireAuth = (req, res, next) => {
  try {

    const token =
      req.cookies.token ||
      req.headers.authorization?.split(" ")[1];

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


// Seller role
const requireRoleSeller = (req, res, next) => {
  if (req.userRole === "seller") {
    next();
  } else {
    res.status(403).json({ message: "Unauthorized" });
  }
};


// Admin role
const requireRoleAdmin = (req, res, next) => {
  if (req.userRole === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Unauthorized" });
  }
};


// Buyer role
const requireRoleBuyer = (req, res, next) => {
  if (req.userRole === "buyer") {
    next();
  } else {
    res.status(403).json({ message: "Unauthorized" });
  }
};


// Delivery role
const requireRoleDelivery = (req, res, next) => {
  if (req.userRole === "delivery") {
    next();
  } else {
    res.status(403).json({ message: "Unauthorized" });
  }
};


module.exports = {
  requireAuth,
  requireRoleSeller,
  requireRoleAdmin,
  requireRoleBuyer,
  requireRoleDelivery
};