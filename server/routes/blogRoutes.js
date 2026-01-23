import express from "express";
import {
  addBlog,
  addComment,
  deleteBlogById,
  generateContent,
  getAllBlogs,
  getBlogById,
  getBlogComments,
  togglePublish,
} from "../controllers/blogController.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const blogRouter = express.Router();

// Blogs
blogRouter.post("/add", upload.single("image"), auth, addBlog);
blogRouter.get("/all", getAllBlogs);
blogRouter.get("/:blogId", getBlogById);
blogRouter.post("/delete", auth, deleteBlogById);
blogRouter.post("/toggle-publish", auth, togglePublish);

// Comments
blogRouter.post("/add-comment", auth, addComment);
blogRouter.post("/comments", auth, getBlogComments);

// Generate AI
blogRouter.post("/generate", auth, generateContent);


export default blogRouter;
