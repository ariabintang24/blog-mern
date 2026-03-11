import User from "../models/User.js";

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");

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
