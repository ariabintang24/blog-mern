import express from "express";
import { getUserById } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/:username", getUserById);

export default userRouter;
