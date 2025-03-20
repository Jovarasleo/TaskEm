import express from "express";
import { login, logout, register } from "../controllers/auth.controller.js";
import {
  generateUrl,
  googleLogin,
} from "../controllers/authGoogle.controller.js";

const router = express.Router();

router.get("/google", generateUrl);
router.get("/google/callback", googleLogin);
router.post("/login", login);
router.post("/logout", logout);
router.post("/", register);

export default router;
