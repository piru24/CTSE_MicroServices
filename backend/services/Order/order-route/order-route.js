const express = require("express");
const router = express.Router();

const orderController = require("../order-controller/order-controller");
const requireAccess = require("../middlewares");

router.post("/addOrder",
  requireAccess.requireAuth,
  orderController.addOrder
);

router.get("/getOrders", orderController.getAllOrder);

router.get("/getOrder/:id", orderController.getOrder);

router.get("/orderhistory",
  requireAccess.requireAuth,
  requireAccess.requireRoleBuyer,
  orderController.getOrderByBuyersId
);

router.put("/updateOrder/:id", orderController.updateOrder);

router.delete("/deleteOrder/:id",
  requireAccess.requireAuth,
  requireAccess.requireRoleSeller,
  orderController.deleteOrder
);

router.post("/payment",
  requireAccess.requireAuth,
  requireAccess.requireRoleBuyer,
  orderController.stripePay
);

router.get("/dispatchedOrders",
  requireAccess.requireAuth,
  requireAccess.requireRoleDelivery,
  orderController.getDispatchedOrders
);

module.exports = router;