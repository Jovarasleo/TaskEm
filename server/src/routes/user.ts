import express from "express";
import { getUserData } from "../controllers/user.controller.js";

const router = express.Router();
router.get("/", getUserData);

export default router;
