const router = require("express").Router();
const emailController= require("../controllers/emailController");
const auth = require("../middlewares");


router.get("/", emailController.pingEmailServer);
router.post("/sendMail", auth.requireAuth, emailController.sendMail);


module.exports = router;