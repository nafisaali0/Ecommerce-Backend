const express = require("express");
const router = express.Router();
const {
  createUser,
  loginUser,
  getAllUser,
  getSingleUser,
  deleteUser,
  updateUser,
  blockUser,
  unBlockUser,
  handleRefreshToken,
  logoutUser,
  updatePassword,
  forgetPasswordToken,
  resetPasswordToken,
  loginAdmin,
  getWishlist,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
} = require("../controller/userCntrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.post("/regester", createUser);
router.post("/forget-password-token", forgetPasswordToken);
router.put("/reset-password/:token", resetPasswordToken);

router.put("/update-password", authMiddleware, updatePassword);
router.post("/login", loginUser);
router.post("/login-admin", loginAdmin);
router.post("/cart", authMiddleware, userCart);

router.get("/all-user", getAllUser);
router.get("/refresh-token", handleRefreshToken);
router.get("/logout", logoutUser);
router.get("/all-wishlist", authMiddleware, getWishlist);
router.get("/all-cart", authMiddleware, getUserCart);
router.get("/:id", authMiddleware, isAdmin, getSingleUser);

router.delete("/empty-cart", authMiddleware, emptyCart);
router.delete("/:id", deleteUser);

router.put("/edit-user", authMiddleware, updateUser);
router.put("/save-address", authMiddleware, saveAddress);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unBlockUser);

module.exports = router;
