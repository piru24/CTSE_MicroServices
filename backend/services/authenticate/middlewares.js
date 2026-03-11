const jwt = require('jsonwebtoken');

let decoded;
let roleOne;

const requireAuth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    // Allow logout to proceed even if the token is missing
    if (req.path === "/logout") {
      return next();
    }
    return res.status(401).json({ message: "Authentication required. Please log in." });
  }

  jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
    if (err) {
      console.error("Token verification failed:", err);
      // Allow logout to proceed even if the token is invalid
      if (req.path === "/logout") {
        return next();
      }
      return res.status(403).json({ message: "Invalid or expired token. Please log in again." });
    }

    req.userId = decodedToken._id;
    req.userRole = decodedToken.role;
    next();
  });
};


const requireRoleSeller = async (req, res, next) => {
  console.log(decoded.role)
  if (decoded.role === "seller") {
    next();
  } else {
    res.status(403).json({ message: 'Unauthorized' });
  }

}

const requireRoleAdmin = async (req, res, next) => {
  if (decoded.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: 'Unauthorized' });
  }

}

const requireRoleBuyer = async (req, res, next) => {
  if (decoded.role === "buyer") {
    next();
  } else {
    res.status(403).json({ message: 'Unauthorized' });
  }

}

// delivery person
const requireRoleDelivery = (req, res, next) => {
  if (req.userRole === "delivery") {
    next();
  } else {
    res.status(403).json({ message: 'Unauthorized' });
  }
};

exports.requireAuth = requireAuth
exports.requireRoleSeller = requireRoleSeller;
exports.requireRoleAdmin = requireRoleAdmin;
exports.requireRoleBuyer = requireRoleBuyer;
exports.requireRoleDelivery = requireRoleDelivery;