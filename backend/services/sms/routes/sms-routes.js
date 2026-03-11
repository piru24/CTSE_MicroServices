const router = require("express").Router();
const smsController = require("../controllers/smsController");
const requireAccess = require("../middlewares");


router.get("/", requireAccess.requireAuth, smsController.pingSmsServer);
// router.post("/sendSms", requireAccess.requireAuth, smsController.sendSms);
router.post("/sendSms", requireAccess.requireAuth, smsController.sendDummySms);


module.exports = router;