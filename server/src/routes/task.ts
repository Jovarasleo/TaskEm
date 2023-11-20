import express from "express";
import { getTasks, setTask } from "../controllers/task.controller.js";

const router = express.Router();

router.post("/", setTask);
router.get("/", getTasks);

export default router;
