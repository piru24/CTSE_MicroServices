const router = require("express").Router();
const deliveryController = require('../controllers/deliveryController');
const requireAccess  = require("../middlewares")

router.get("/", deliveryController.pingDeliveryServer);
router.post("/rate", deliveryController.getRate);
// router.post("/sendMail",emailController.sendMail);

// Accept Order Route
router.post("/accept", deliveryController.acceptDelivery);

module.exports = router;