const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
  createBlog,
  updateSingleBlog,
  getSingleBlog,
  getAllBlog,
  deleteSingleBlog,
  likeBlog,
  dislikeBlog,
} = require("../controller/blogCtrl");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createBlog);
router.put("/likes", authMiddleware, likeBlog);
router.put("/dislikes", authMiddleware, dislikeBlog);

router.put("/:id", authMiddleware, isAdmin, updateSingleBlog);

router.get("/:id", getSingleBlog);
router.get("/", getAllBlog);

router.delete("/:id", authMiddleware, isAdmin, deleteSingleBlog);

module.exports = router;
