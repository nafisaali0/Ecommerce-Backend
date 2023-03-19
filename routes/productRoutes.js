const express = require("express");
const {
  createProduct,
  getSingleProduct,
  getAllProducts,
  updateSingleProduct,
  deleteSingleProduct,
  addToWishList,
  rating,
  uploadImages,
} = require("../controller/produtctrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const { uploadPhoto, productImageResize } = require("../middlewares/uploadImages");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createProduct);
router.put(
  "/upload/:id",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images",10),
  productImageResize,
  uploadImages
);
router.get("/:id", getSingleProduct);
router.put("/wishlist", authMiddleware, addToWishList);
router.put("/rating", authMiddleware, rating);

router.put("/:id", authMiddleware, isAdmin, updateSingleProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteSingleProduct);
router.get("/", getAllProducts);

module.exports = router;
