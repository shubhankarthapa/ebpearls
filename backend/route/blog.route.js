import express from "express";
import isAuthenticated from "../middleware/authentication.js";
import {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
    likeBlog,
    dislikeBlog,
    addComment,
    deleteComment,
    getUserBlogs
} from "../controllers/blog.controller.js";

const router = express.Router();

// Public routes
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.get("/user/:userId", getUserBlogs);

// Protected routes (authentication required)
router.post("/", isAuthenticated, createBlog);
router.put("/:id", isAuthenticated, updateBlog);
router.delete("/:id", isAuthenticated, deleteBlog);

// Like/Dislike routes
router.post("/:id/like", isAuthenticated, likeBlog);
router.post("/:id/dislike", isAuthenticated, dislikeBlog);

// Comment routes
router.post("/:id/comments", isAuthenticated, addComment);
router.delete("/:blogId/comments/:commentId", isAuthenticated, deleteComment);

export default router; 