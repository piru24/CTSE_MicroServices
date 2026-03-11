const express = require("express");
const router = express.Router();
const productController= require("../controllers/productController");
const requireAccess  = require("../middlewares")

router.use(requireAccess.requireAuth)

router.post("/addProduct", requireAccess.requireAuth, requireAccess.requireRoleSeller, productController.addProduct);
router.get("/getProducts", requireAccess.requireAuth, requireAccess.requireRoleBuyer, productController.getAllProducts);
router.get("/getProduct/:id",requireAccess.requireAuth, requireAccess.requireRoleBuyerOrSeller, productController.getById);
router.put("/updateProduct/:id",requireAccess.requireAuth, requireAccess.requireRoleSeller, productController.updateProduct);
router.delete("/deleteProduct/:id",requireAccess.requireAuth, requireAccess.requireRoleSeller, productController.deleteProduct);
router.get("/search/", requireAccess.requireAuth, requireAccess.requireRoleBuyer, productController.getSearch)
router.get("/:sellerId/products", requireAccess.requireAuth, requireAccess.requireRoleSeller, productController.getBySellerId)


module.exports = router;