const express = require("express");
const router = express.Router();
const productController= require("../controllers/productController");
const requireAccess  = require("../middlewares")

router.use(requireAccess.requireAuth)

router.use(requireAccess.requireAuth);

router.post("/addProduct", requireAccess.requireRoleSeller, productController.addProduct);
router.get("/getProducts", requireAccess.requireRoleBuyer, productController.getAllProducts);
router.get("/getProduct/:id", requireAccess.requireRoleBuyerOrSeller, productController.getById);
router.put("/updateProduct/:id", requireAccess.requireRoleSeller, productController.updateProduct);
router.delete("/deleteProduct/:id", requireAccess.requireRoleSeller, productController.deleteProduct);
router.get("/search/", requireAccess.requireRoleBuyer, productController.getSearch);
router.get("/:sellerId/products", requireAccess.requireRoleSeller, productController.getBySellerId);


module.exports = router;