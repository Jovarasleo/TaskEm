import express from "express";
import { getUserByUuid, setUser, login } from "../controllers/user.controller";

const router = express.Router();
router.post("/", setUser);
router.get("/:id", getUserByUuid);
router.post("/login", login);

export default router;
