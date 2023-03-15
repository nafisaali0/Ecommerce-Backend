const express = require("express");
const {
  createProduct,
  getSingleProduct,
  getAllProducts,
  updateSingleProduct,
  deleteSingleProduct,
} = require("../controller/produtctrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/",authMiddleware,  isAdmin, createProduct);
router.get("/:id", getSingleProduct);
router.put("/:id", authMiddleware, isAdmin, updateSingleProduct);
router.delete("/:id",authMiddleware, isAdmin,  deleteSingleProduct);
router.get("/", getAllProducts);

module.exports = router;
