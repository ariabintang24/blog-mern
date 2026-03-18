import express from "express";
import upload from "../middleware/multer.js";
import { registerUser, loginUser } from "../controllers/authController.js";

const authRouter = express.Router();

// authRouter.post("/register", registerUser);
authRouter.post("/register", upload.single("avatar"), registerUser);
authRouter.post("/login", loginUser);

export default authRouter;
