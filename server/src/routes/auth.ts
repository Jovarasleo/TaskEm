import express from "express";
import { loginUserController, logout, createUserController } from "../controllers/auth.controller.js";
import { generateGoogleLoginUrlController, googleLoginController } from "../controllers/authGoogle.controller.js";

const router = express.Router();

router.get("/google", generateGoogleLoginUrlController);
router.get("/google/callback", googleLoginController);
router.post("/login", loginUserController);
router.post("/logout", logout);
router.post("/", createUserController);

export default router;
