const express = require("express");
const router = express.Router();
const cart = require("../model/cart");
const cartController= require("../cart-controllers/cart-controllers");
 
const requireAccess  = require("../middlewares")

router.post("/addCart", requireAccess.requireAuth, requireAccess.requireRoleBuyer, cartController.addCart);
router.get("/getCarts", requireAccess.requireAuth, requireAccess.requireRoleBuyer, cartController.getAllCarts);
router.get("/getCart/:userId",requireAccess.requireAuth, requireAccess.requireRoleBuyer, cartController.getCart);
router.put("/updateCart/:id",requireAccess.requireAuth, requireAccess.requireRoleBuyer, cartController.updateCart);
router.delete("/deleteProduct/:id",requireAccess.requireAuth, requireAccess.requireRoleBuyer, cartController.deleteCart);

module.exports = router;