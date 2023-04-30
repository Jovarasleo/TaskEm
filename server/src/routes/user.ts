import express from "express";
import { getUserByUuid, setUser, login } from "../controllers/user.controller";

const router = express.Router();
router.get("/login", login);
router.get("/:id", getUserByUuid);
router.post("/", setUser);

export default router;
