import express from "express";
import auth from "../middleware/auth.js";
import {
  getUserById,
  updateUserProfile,
  changePassword
} from "../controllers/userController.js";
import authRouter from "./authRoutes.js";

const userRouter = express.Router();

userRouter.get("/:username", getUserById);
userRouter.put("/update-profile", updateUserProfile);
userRouter.patch("/change-password", auth, changePassword);
export default userRouter;
