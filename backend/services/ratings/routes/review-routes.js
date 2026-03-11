const express = require("express");
const router = express.Router();
const reviews = require("../model/review");
const reviewController= require("../controllers/reviewController");
const requireAuth = require("../middlewares")


router.post("/addReview",requireAuth.requireAuth, requireAuth.requireRoleBuyer,reviewController.addReview);
router.get("/getReviews",requireAuth.requireAuth, requireAuth.requireRoleBuyer, reviewController.getAllReviews);
router.get("/getId/:id",requireAuth.requireAuth, requireAuth.requireRoleBuyer, reviewController.getById);
router.put("/updateReview/:id",requireAuth.requireAuth, requireAuth.requireRoleBuyer, reviewController.updateReview);
router.delete("/deleteReview/:id",requireAuth.requireAuth, requireAuth.requireRoleBuyer, reviewController.deleteReview);

module.exports = router;