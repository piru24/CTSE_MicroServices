const express = require("express");
const router = express.Router();

const orderController = require("../order-controller/order-controller");
const requireAccess = require("../middlewares");
const {
  validateCreateOrder,
  validateUpdateStatus,
  validateMongoId,
  validatePayment,
} = require("../services/validation");

router.get("/health", orderController.health);
router.get("/ready", orderController.readiness);

router.post("/",
  requireAccess.requireAuth,
  requireAccess.requireRoleBuyer,
  validateCreateOrder,
  orderController.addOrder
);

router.get("/",
  requireAccess.requireAuth,
  requireAccess.requireRole("seller", "admin"),
  orderController.getAllOrder
);

router.get("/history/me",
  requireAccess.requireAuth,
  requireAccess.requireRoleBuyer,
  orderController.getOrderByBuyersId
);

router.get("/dispatched",
  requireAccess.requireAuth,
  requireAccess.requireRoleDelivery,
  orderController.getDispatchedOrders
);

router.post("/payment",
  requireAccess.requireAuth,
  requireAccess.requireRoleBuyer,
  validatePayment,
  orderController.stripePay
);

router.patch("/:id/status",
  requireAccess.requireAuth,
  requireAccess.requireRole("seller", "admin"),
  validateMongoId("id"),
  validateUpdateStatus,
  orderController.updateOrderStatus
);

router.delete("/:id",
  requireAccess.requireAuth,
  requireAccess.requireRole("seller", "admin"),
  validateMongoId("id"),
  orderController.deleteOrder
);

// Backward compatibility aliases for existing frontend calls
router.post("/addOrder",
  requireAccess.requireAuth,
  requireAccess.requireRoleBuyer,
  validateCreateOrder,
  orderController.addOrder
);

router.get("/getOrders",
  requireAccess.requireAuth,
  requireAccess.requireRole("seller", "admin"),
  orderController.getAllOrder
);

router.get("/orderhistory",
  requireAccess.requireAuth,
  requireAccess.requireRoleBuyer,
  orderController.getOrderByBuyersId
);

router.get("/dispatchedOrders",
  requireAccess.requireAuth,
  requireAccess.requireRoleDelivery,
  orderController.getDispatchedOrders
);

router.put("/updateOrder/:id",
  requireAccess.requireAuth,
  requireAccess.requireRole("seller", "admin"),
  validateMongoId("id"),
  validateUpdateStatus,
  orderController.updateOrder
);

router.delete("/deleteOrder/:id",
  requireAccess.requireAuth,
  requireAccess.requireRole("seller", "admin"),
  validateMongoId("id"),
  orderController.deleteOrder
);

router.get("/getOrder/:id",
  requireAccess.requireAuth,
  validateMongoId("id"),
  orderController.getOrder
);

router.get("/:id",
  requireAccess.requireAuth,
  validateMongoId("id"),
  orderController.getOrder
);

module.exports = router;
