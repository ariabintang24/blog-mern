import User from "../models/User.js";

export const getUserById = async (req, res) => {
  try {
    const { username } = req.params;

   const user = await User.findOne({ username });

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
