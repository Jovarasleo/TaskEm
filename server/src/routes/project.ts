import express from "express";

import { getProjects } from "../controllers/project.controller.js";
import { setProject } from "../controllers/project.controller.js";

const router = express.Router();

router.get("/", getProjects);
router.post("/", setProject);

export default router;
