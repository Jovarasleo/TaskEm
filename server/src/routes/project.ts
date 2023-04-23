import express from "express";
import {
  getAllProjects,
  getProjectById,
} from "../controllers/project.controller";

const router = express.Router();

router.get("/", getAllProjects);
router.get("/:id", getProjectById);
