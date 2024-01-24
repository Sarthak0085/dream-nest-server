import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";
import upload from "../middleware/uploader.js";

const authRouter = Router();

/* USER REGISTER */
authRouter.post("/register", upload.single("profileImage"), register);

/* USER LOGIN*/
authRouter.post("/login", login)

export default authRouter;