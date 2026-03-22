const router = require("express").Router();
const deliveryController = require('../controllers/deliveryController');
const requireAccess  = require("../middlewares")

router.get("/", deliveryController.getAllDeliveries);
router.post("/rate", deliveryController.getRate);
// router.post("/sendMail",emailController.sendMail);

router.post("/accept", deliveryController.acceptDelivery);
router.post("/create", deliveryController.createDelivery);

router.post("/start", deliveryController.startDelivery);
router.post("/arrived", deliveryController.markArrived);
router.post("/complete", deliveryController.completeDelivery);
module.exports = router; 