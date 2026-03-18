import User from "../models/User.js";
import bcrypt from "bcryptjs";
import fs from "fs";
import imagekit from "../configs/imageKit.js";

export const getUserById = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username }).select("-password");

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { name, username } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    user.name = name;
    user.username = username;

    // Jika ada file avatar
    if (req.file) {
      const fileBuffer = fs.readFileSync(req.file.path);

      const response = await imagekit.upload({
        file: fileBuffer,
        fileName: req.file.originalname,
        folder: "/avatars",
      });

      const avatarUrl = imagekit.url({
        path: response.filePath,
        transformation: [{ width: "300" }],
      });

      user.avatar = avatarUrl;
    }

    await user.save();

    res.json({
      success: true,
      user,
      message: "Profile updated",
    });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Current password incorrect",
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.message,
    });
  }
};
