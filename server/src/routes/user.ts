import express from "express";
import {
  getUserData,
  setUser,
  login,
  logout,
} from "../controllers/user.controller.js";

const router = express.Router();
router.post("/login", login);
router.post("/logout", logout);
router.post("/", setUser);
router.get("/", getUserData);

export default router;
