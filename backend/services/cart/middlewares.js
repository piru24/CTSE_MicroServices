const jwt = require('jsonwebtoken');

let decoded;
let roleOne;
const requireAuth = async (req, res, next) => {
  try {
    const cookie = req.headers.cookie;
    if (!cookie)
      return res.status(403).send("Login requried!");

    const token = cookie.split("=")[1];
    if (!token)
      return res.status(403).send("A token is required for authentication.");

    decoded = jwt.verify(token, process.env.SECRET);
    console.log("user Id  " + decoded._id)
    req.userId = decoded._id;
    roleOne = decoded.role;
    console.log(roleOne)
    console.log("req.userId  " + req.userId)

    next();

  } catch (err) {
    console.error(err);
    return res.status(401).send(new Error('Invalid token'));
  }

}

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
