import express from "express";
import { loginUserController, logout, createUserController, userAuthenticatedController } from "../controllers/auth.controller.js";
import { generateGoogleLoginUrlController, googleLoginController } from "../controllers/authGoogle.controller.js";

const router = express.Router();

router.get("/google", generateGoogleLoginUrlController);
router.get("/google/callback", googleLoginController);
router.post("/login", loginUserController);
router.post("/logout", logout);
router.get("/isAuth", userAuthenticatedController);
router.post("/", createUserController);

export default router;
