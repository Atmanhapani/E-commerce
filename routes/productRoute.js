const express = require("express");
const router = express.Router();
const {
  createProduct,
  getaProduct,
  getallProduct,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
} = require("../controller/productCtrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, isAdmin, createProduct);
router.get("/:id", getaProduct);
router.put("/wishlist",authMiddleware,addToWishlist);
router.put("/rating",authMiddleware,rating);
router.get("/", getallProduct);
router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

module.exports = router;
