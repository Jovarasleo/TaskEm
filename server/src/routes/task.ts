import express from "express";
import { setTask } from "../controllers/task.controller";

const router = express.Router();

router.post("/", setTask);

export default router;
