const router = require("express").Router();
const paymentController = require("../controllers/paymentController");
const auth = require("../middlewares");

// Ping route
router.get("/", paymentController.pingPaymentServer);

// Payment route
router.post("/card", auth.requireAuth, paymentController.dummyCardPayment);

module.exports = router;