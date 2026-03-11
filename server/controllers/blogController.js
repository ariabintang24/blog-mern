import fs from "fs";
import imagekit from "../configs/imageKit.js";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
// import main from "../configs/gemini.js";

export const addBlog = async (req, res) => {
  try {
    const { title, subTitle, description, category, isPublished } = JSON.parse(
      req.body.blog,
    );

    const imageFile = req.file;

    // Check if all fields are present
    if (!title || !description || !category || !imageFile) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    //Upload Image to ImageKit
    const fileBuffer = fs.readFileSync(imageFile.path);
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/blogs",
    });

    //Optimization through imageKit URL transformation

    const optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { quality: "auto" }, //Auto compression
        { format: "webp" }, // Convert to modern format
        { width: "1280" }, // Width resizing
      ],
    });

    const image = optimizedImageUrl;
    await Blog.create({
      title,
      subTitle,
      description,
      category,
      image,
      isPublished,
    });

    res.json({ success: true, message: "Blog added successfully" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true });
    res.json({ success: true, blogs });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.json({ success: false, message: "Blog Not Found" });
    }
    res.json({ success: true, blog });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const deleteBlogById = async (req, res) => {
  try {
    const { id } = req.body;
    await Blog.findByIdAndDelete(id);

    //Delete all comments associated with the blog
    await Comment.deleteMany({ blog: id });

    res.json({ success: true, message: "Blog Deleted Successfully" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const togglePublish = async (req, res) => {
  try {
    const { id } = req.body;
    //Memanggil dari file Blog.js
    const blog = await Blog.findById(id);
    blog.isPublished = !blog.isPublished;
    await blog.save();
    res.json({ success: true, message: "Blog Status Updated" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { blog, name, content } = req.body;
    //Memanggil dari file Comment.js
    await Comment.create({ blog, name, content });
    res.json({ success: true, message: "Comment Added for Review" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const getBlogComments = async (req, res) => {
  try {
    const { blogId } = req.body;

    //Memanggil dari file Comment.js
    const comments = await Comment.find({
      blog: blogId,
      isApproved: true,
    }).sort({ createdAt: -1 });

    res.json({ success: true, comments });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Generate AI
// export const generateContent = async (req, res) => {
//   try {
//     // Mendapatkan prompt dari request body, kapanpun memanggil API kita harus melalui request body
//     const { prompt } = req.body;
//     const content = await main(
//       prompt + "Generate a blog content for this topic in simple text format"
//     );
//     res.json({ success: true, content });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };
