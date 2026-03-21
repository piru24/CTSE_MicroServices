const User = require("../models/users");
const crypto = require("crypto");
const {
  publishUserSignup,
  publishUserCreated,
  publishSellerAvailability
} = require("../services/rabbitmq");

const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");


// Create JWT token
const createToken = (_id, role, name) => {
  return jwt.sign({ _id, role, name }, process.env.SECRET, {
    expiresIn: "60m"
  });
};


// SIGNUP
const signUp = async (req, res) => {

  try {

    const { name, mobile, email, address, password, role } = req.body;

    //const verificationToken = crypto.randomBytes(32).toString("hex");

    if (!name || !mobile || !email || !address || !password) {
      return res.status(400).json({ message: "All fields must be filled" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Email not valid" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists. Login instead."
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    const user = new User({
  name,
  mobile,
  email,
  address,
  password: hashedpassword,
  role: role || "buyer",
 // isVerified: true
});

    await user.save();

  /*  publishUserSignup({
      userId: user._id,
      email: user.email,
      token: verificationToken
    });*/

    res.status(201).json({
      message: "Registration successful.",
      userId: user._id,
      email: user.email
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error saving user" });
  }
};


// LOGIN
const login = async (req, res) => {

  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields must be filled" });
    }

    const loggeduser = await User.findOne({ email });

    if (!loggeduser) {
      return res.status(400).json({
        message: "User not found. Sign up first."
      });
    }

  /*  if (!loggeduser.isVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in"
      });
    }*/

    const isPasswordCorrect = await bcrypt.compare(
      password,
      loggeduser.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid email/password"
      });
    }

    const token = createToken(
      loggeduser._id,
      loggeduser.role,
      loggeduser.name
    );

    res.cookie("token", token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 60 * 60),
      httpOnly: true,
      sameSite: "lax"
    });

    res.status(200).json({
      message: "Successfully logged in",
      User: loggeduser,
      token
    });

  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};


// GET OWN PROFILE
const getUser = async (req, res) => {

  try {

    const user = await User.findById(req.userId, "-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


// GET USER BY ID
const getUserById = async (req, res) => {

  try {

    const user = await User.findById(req.params.id, "-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


// GET ALL USERS
const getUsers = async (req, res) => {

  try {

    const users = await User.find({});

    res.status(200).json({ users });

  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
};


// LOGOUT
const logout = (req, res) => {

  res.clearCookie("token");

  res.status(200).json({
    message: "Successfully logged out"
  });
};


// DELETE USER
const deleteUser = async (req, res) => {

  try {

    await User.findByIdAndDelete(req.userId);

    res.clearCookie("token");

    res.json({
      message: "Account deleted successfully"
    });

  } catch (err) {
    res.status(500).json({
      message: "Error deleting account"
    });
  }
};


// SET SELLER AVAILABILITY
const setAvailability = async (req, res) => {

  try {

    const user = await User.findById(req.userId);

    if (!user || user.role !== "seller") {
      return res.status(403).json({
        message: "Not authorized"
      });
    }

    user.isAvailable = req.body.isAvailable;

    await user.save();

    publishSellerAvailability({
      sellerId: user._id,
      isAvailable: user.isAvailable
    });

    res.json({
      message: "Availability updated",
      isAvailable: user.isAvailable
    });

  } catch (err) {
    res.status(500).json({
      message: "Server error"
    });
  }
};


// GET SELLER INFO
const getSellerInfo = async (req, res) => {

  try {

    const user = await User.findById(req.userId, "-password");

    if (!user || user.role !== "seller") {
      return res.status(403).json({
        message: "Not authorized"
      });
    }

    res.json({
      name: user.name,
      email: user.email,
      address: user.address,
      mobile: user.mobile,
      isAvailable: user.isAvailable
    });

  } catch (err) {
    res.status(500).json({
      message: "Server error"
    });
  }
};


// VERIFY EMAIL
/*const verifyEmail = async (req, res) => {

  try {

    const token = req.params.token;

    const user = await User.findOne({
      verificationToken: token
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid verification token"
      });
    }

    user.isVerified = true;
    user.verificationToken = null;

    await user.save();

    publishUserCreated({
      userId: user._id,
      email: user.email,
      role: user.role
    });

    res.json({
      message: "Email verified successfully"
    });

  } catch (err) {
    res.status(500).json({
      message: "Verification failed"
    });
  }
};*/

// UPDATE PROFILE
const updateProfile = async (req, res) => {
  try {

    const { name, mobile, email, address } = req.body;

    if (!name || !mobile || !email || !address) {
      return res.status(400).json({
        message: "All fields must be filled"
      });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, mobile, email, address },
      { new: true }
    );

    res.status(200).json({ user });

  } catch (err) {
    res.status(500).json({
      message: "Error updating profile"
    });
  }
};


// UPDATE PASSWORD
const updatePassword = async (req, res) => {

  try {

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Both passwords required"
      });
    }

    const user = await User.findById(req.userId);

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Old password incorrect"
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.status(200).json({
      message: "Password updated successfully"
    });

  } catch (err) {
    res.status(500).json({
      message: "Error updating password"
    });
  }
};

module.exports = {
  signUp,
  login,
  getUserById,
  getUsers,
  getUser,
  logout,
  deleteUser,
  updateProfile,
  updatePassword,
  setAvailability,
  getSellerInfo,
  //verifyEmail
};