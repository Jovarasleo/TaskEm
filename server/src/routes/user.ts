import express from "express";
import { getUserByUuid, setUser } from "../controllers/user.controller";

const router = express.Router();
router.get("/:id", getUserByUuid);
router.post("/", setUser);

export default router;
