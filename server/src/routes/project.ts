import express from "express";

import { getProjects } from "../controllers/project.controller";
import { setProject } from "../controllers/project.controller";

const router = express.Router();

router.get("/", getProjects);
router.post("/", setProject);

export default router;
