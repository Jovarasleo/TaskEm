import express from "express";
import { getUserData, setUser, login } from "../controllers/user.controller";

const router = express.Router();
router.post("/login", login);
router.post("/", setUser);
router.get("/", getUserData);

export default router;
