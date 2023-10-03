import express from "express";

import { getAllUserProjects } from "../controllers/project.controller";
import { setProject } from "../controllers/project.controller";

const router = express.Router();

router.get("/", getAllUserProjects);
router.post("/", setProject);

export default router;
