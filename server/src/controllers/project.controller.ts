import {
  getUserProjectsGateway,
  setProjectGateway,
} from "../gateways/project.gateway";
import { Request, Response, NextFunction } from "express";
import { createProject, getProjects } from "../handlers/projectHandlers";

export const getAllUserProjects = async (req: Request, res: Response) => {
  const { uuid } = req.body;

  try {
    const projects = getProjects({ getUserProjectsGateway }, uuid);
    const response = await projects;
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error: get projects" });
  }
};

export const setProject = async (req: Request, res: Response) => {
  const { projectId, projectName, uuid } = req.body;

  try {
    const projects = createProject(
      { setProjectGateway },
      { projectId, projectName, uuid }
    );
    const response = await projects;
    res.status(200).send(response);
  } catch (error) {
    console.log({ error });
    res.status(500).send({ error: "Internal Server Error: get projects" });
  }
};
