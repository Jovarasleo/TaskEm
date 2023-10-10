import express from "express";
import { getUserData, setUser, login } from "../controllers/user.controller";

const router = express.Router();
router.post("/", setUser);
router.get("/", getUserData);
router.post("/login", login);

export default router;
