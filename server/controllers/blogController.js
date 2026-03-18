import fs from "fs";
import imagekit from "../configs/imageKit.js";
import Blog from "../models/Blog.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
// import main from "../configs/gemini.js";

const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

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

    // ✦ SLUG GENERATION
    let slug = slugify(title);

    // ✦ HANDLE DUPLICATE SLUG
    let existing = await Blog.findOne({ slug });
    let count = 1;

    while (existing) {
      slug = `${slugify(title)}-${count}`;
      existing = await Blog.findOne({ slug });
      count++;
    }

    await Blog.create({
      title,
      subTitle,
      description,
      category,
      image,
      isPublished,
      slug,
      author: req.user?.id || null,
      authorRole: req.user?.role || "admin",
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

export const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    let blog = await Blog.findOne({ slug }).populate("author");

    // ✦ fallback ke _id
    if (!blog) {
      blog = await Blog.findById(slug).populate("author");
    }

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog Not Found",
      });
    }

    res.json({ success: true, blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// export const getBlogById = async (req, res) => {
//   try {
//     const { blogId } = req.params;
//     const blog = await Blog.findById(blogId).populate("author");
//     if (!blog) {
//       return res.json({ success: false, message: "Blog Not Found" });
//     }
//     res.json({ success: true, blog });
//   } catch (err) {
//     res.json({ success: false, message: err.message });
//   }
// };

export const deleteBlogById = async (req, res) => {
  try {
    const { id } = req.body;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }

    // jika ada author dan bukan admin
    if (
      blog.author &&
      blog.author.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    await Blog.findByIdAndDelete(id);

    // delete komentar terkait
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
    const { blog, content } = req.body;

    await Comment.create({
      blog,
      content,
      user: req.user.id,
    });

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
    })
      .populate("user", "username name avatar")
      .sort({ createdAt: -1 });

    res.json({ success: true, comments });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { id, title, subTitle, description, category } = JSON.parse(
      req.body.blog,
    );

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }

    if (blog.author.toString() !== req.user.id) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    blog.title = title;
    blog.subTitle = subTitle;
    blog.description = description;
    blog.category = category;

    if (req.file) {
      blog.image = req.file.path;
    }

    await blog.save();

    res.json({ success: true, message: "Blog updated successfully" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const deleteUserComment = async (req, res) => {
  try {
    const { id } = req.body;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.json({ success: false, message: "Comment not found" });
    }

    // hanya pemilik komentar yang boleh delete
    if (comment.user.toString() !== req.user.id) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    await Comment.findByIdAndDelete(id);

    res.json({ success: true, message: "Comment deleted successfully" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// export const getUserBlogs = async (req, res) => {
//   try {
//     const { username } = req.params;

//     const user = await User.findOne({ username });

//     if (!user) {
//       return res.json({ success: false, message: "User not found" });
//     }

//     const blogs = await Blog.find({
//       author: user._id,
//       isPublished: true,
//     }).sort({ createdAt: -1 });

//     res.json({ success: true, blogs });
//   } catch (err) {
//     res.json({ success: false, message: err.message });
//   }
// };

export const getBlogsByUser = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const blogs = await Blog.find({
      author: user._id,
      isPublished: true,
    }).sort({ createdAt: -1 });

    res.json({ success: true, blogs });
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
