const { signUp, login, getUsers, getUserById, getUser, logout, updatePassword, deleteUser, updateProfile, setAvailability, getSellerInfo, verifyEmail } = require("../controllers/user-controller");
const { requireAuth, requireRoleSeller, } = require("../middlewares");

const { requireRoleAdmin} = require("../middlewares")

const router = require("express").Router();

router.post("/signUp", signUp);
router.post("/login", login);

router.get("/Users", requireAuth, requireRoleAdmin, getUsers);
router.get("/profile", requireAuth, getUser);
router.get("/:id", getUserById)

router.post("/logout", requireAuth, logout);
router.delete("/deleteUser", requireAuth, deleteUser)
router.patch("/update", requireAuth, updateProfile)
router.patch("/update/pwd", requireAuth, updatePassword);
router.get("/seller/me", requireAuth, requireRoleSeller, getSellerInfo);
router.put("/seller/availability", requireAuth, requireRoleSeller, setAvailability);
 router.put("/seller/availability", (_req,_res,next)=>{
  console.log("ROUTE HIT");
  next();
}, requireAuth, requireRoleSeller, setAvailability);
router.get("/verify/:token", verifyEmail);


module.exports = router;