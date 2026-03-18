import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import imagekit from "../configs/imageKit.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const username = name.toLowerCase().replace(/\s+/g, "");

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let avatarUrl = null;

    // ✦ jika ada avatar
    if (req.file) {
      const fileBuffer = fs.readFileSync(req.file.path);

      const response = await imagekit.upload({
        file: fileBuffer,
        fileName: req.file.originalname,
        folder: "/avatars",
      });

      avatarUrl = imagekit.url({
        path: response.filePath,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
          { width: "300" },
        ],
      });
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      username,
      avatar: avatarUrl, // ✦ bisa null
    });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        username: user.username,
      },
      process.env.JWT_SECRET,
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        avatar: user.avatar, // ✦ kirim ke frontend
      },
    });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        username: user.username,
      },
      process.env.JWT_SECRET,
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
