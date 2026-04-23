const {
  signUp,
  login,
  getUsers,
  getUserById,
  getUser,
  logout,
  updatePassword,
  deleteUser,
  updateProfile,
  setAvailability,
  getSellerInfo,
 // verifyEmail
} = require("../controllers/user-controller");

const { requireAuth, requireRoleSeller, requireRoleAdmin } = require("../middlewares");

const router = require("express").Router();

// Auth
router.post("/signUp", signUp);
router.post("/login", login);
router.post("/logout", requireAuth, logout);

// User
router.get("/Users", requireAuth, requireRoleAdmin, getUsers);
router.get("/profile", requireAuth, getUser);
router.get("/:id", getUserById);

// Account
router.delete("/deleteUser", requireAuth, deleteUser);
router.patch("/update", requireAuth, updateProfile);
router.patch("/update/pwd", requireAuth, updatePassword);

// Seller
router.get("/seller/me", requireAuth, requireRoleSeller, getSellerInfo);
router.put("/seller/availability", requireAuth, requireRoleSeller, setAvailability);

// Email verification
//router.get("/verify/:token", verifyEmail);

module.exports = router;