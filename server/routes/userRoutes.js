import express from "express";
import { forgotPassword, getCars, getUserData, loginUser, registerUser, resetPassword } from "../controllers/userControllers.js";
import { protect } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);

userRouter.post("/login", loginUser);

userRouter.post("/forgot-password", forgotPassword);

userRouter.post("/reset-password/:resetToken", resetPassword);

userRouter.get("/data", protect, getUserData);

userRouter.get("/cars", getCars);

export default userRouter;

