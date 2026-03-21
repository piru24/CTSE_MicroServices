const express = require("express");
const router = express.Router();
const orderController= require("../order-controller/order-controller");
const requireAccess  = require("../middlewares");
const {
	validateCreateOrder,
	validateUpdateOrderStatus,
	validateStripePayment
} = require("../middleware/validateOrder");

router.get("/health", orderController.health);

router.post(
	"/addOrder",
	requireAccess.requireAuth,
	requireAccess.requireRoleBuyer,
	validateCreateOrder,
	orderController.addOrder
);

router.get(
	"/getOrders",
	requireAccess.requireAuth,
	requireAccess.requireRole("seller", "admin"),
	orderController.getAllOrder
);

router.get(
	"/getOrder/:id",
	requireAccess.requireAuth,
	requireAccess.requireRole("buyer", "seller", "admin", "delivery"),
	orderController.getOrder
);

router.get("/orderhistory", requireAccess.requireAuth, requireAccess.requireRoleBuyer, orderController.getOrderByBuyersId);

router.put(
	"/updateOrder/:id",
	requireAccess.requireAuth,
	requireAccess.requireRole("seller", "admin", "delivery"),
	validateUpdateOrderStatus,
	orderController.updateOrder
);

router.delete(
	"/deleteOrder/:id",
	requireAccess.requireAuth,
	requireAccess.requireRole("seller", "admin"),
	orderController.deleteOrder
);

router.post(
	"/payment",
	requireAccess.requireAuth,
	requireAccess.requireRoleBuyer,
	validateStripePayment,
	orderController.stripePay
);

router.get(
	"/dispatchedOrders",
	requireAccess.requireAuth,
	requireAccess.requireRole("delivery", "seller", "admin"),
	orderController.getDispatchedOrders
);

module.exports = router;