import express from "express";

import { getAllUserProjects } from "../controllers/project.controller";

const router = express.Router();

router.get("/", getAllUserProjects);

export default router;
