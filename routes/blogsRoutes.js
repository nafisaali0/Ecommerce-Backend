const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { createBlog, updateSingleBlog, getSingleBlog, getAllBlog, deleteSingleBlog } = require("../controller/blogCtrl");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createBlog);
router.get("/:id", getSingleBlog);
router.put("/:id", authMiddleware, isAdmin, updateSingleBlog);
router.delete("/:id",authMiddleware, isAdmin,  deleteSingleBlog);
router.get("/", getAllBlog);
module.exports = router;
