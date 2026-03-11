const router = require("express").Router();
const paymentController= require("../controllers/paymentController");
const auth = require("../middlewares");


router.get("/", paymentController.pingPaymentServer);
router.post("/card", auth.requireAuth, auth.requireRoleBuyer, paymentController.dummyCardPayment);


module.exports = router;