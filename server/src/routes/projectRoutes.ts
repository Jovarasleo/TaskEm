import express from "express";
import {
  getAllProjects,
  createNewProject,
  getProjectById,
} from "../controllers/project.controller";
const router = express.Router();

export const getProjectsRouter = router.get("/", getAllProjects);
// .post("/", createNewProject);
// export const setNewProjectRouter = post("/", createNewProject);
export const getProjectByIdRouter = router.get("/:id", getProjectById);
// router
//   .route("/")
//   .get(postControllers.getAllProjects)
//   .post(postControllers.createNewProject);

// router.route("/:id").get(postControllers.getProjectById);
