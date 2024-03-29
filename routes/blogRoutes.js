const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { createBlog, updateBlog, getBlog, getAllBLogs, deleteBlog, liketheBlog, disliketheBlog, uploadImages } = require("../controller/blogCtrl");
const { blogImageResize, uploadPhoto } = require("../middlewares/uploadImage");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createBlog);
router.put("/upload/:id", authMiddleware, isAdmin, uploadPhoto.array("images",2),blogImageResize,uploadImages);
router.put("/likes",authMiddleware,liketheBlog);
router.put("/dislikes",authMiddleware,disliketheBlog);
router.put("/:id", authMiddleware, isAdmin, updateBlog);
router.get("/:id",getBlog);
router.get("/",getAllBLogs);
router.delete("/:id",deleteBlog);

module.exports = router;
