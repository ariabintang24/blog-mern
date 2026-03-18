import express from "express";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";
import {
  getUserById,
  updateUserProfile,
  changePassword,
} from "../controllers/userController.js";
import authRouter from "./authRoutes.js";

const userRouter = express.Router();

userRouter.patch("/change-password", auth, changePassword);
userRouter.put("/update-profile", auth, upload.single("avatar"), updateUserProfile);
userRouter.get("/:username", getUserById);

export default userRouter;
