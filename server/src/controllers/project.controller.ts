import {
  getUserProjectsGateway,
  setProjectGateway,
} from "../gateways/project.gateway";
import { Request, Response, NextFunction } from "express";
import {
  createProjectHandler,
  getProjectsHandler,
} from "../handlers/projectHandlers";

export const getProjects = async (req: Request, res: Response) => {
  const { uuid } = req.body;

  try {
    const response = await getProjectsHandler({ getUserProjectsGateway }, uuid);
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error: get projects" });
  }
};

export const setProject = async (req: Request, res: Response) => {
  const { projectId, projectName, uuid } = req.body;

  try {
    const response = await createProjectHandler(setProjectGateway, {
      projectId,
      projectName,
      uuid,
    });
    res.status(200).send(response);
  } catch (error) {
    console.log({ error });
    res.status(500).send({ error: "Internal Server Error: get projects" });
  }
};

export const setProjectSocketController = async (data: any) => {
  const { projectId, projectName, uuid } = data;

  try {
    const response = await createProjectHandler(setProjectGateway, {
      projectId,
      projectName,
      uuid,
    });
  } catch (error) {
    console.log({ error });
  }
};

export const getProjectsSocketController = async (data: any) => {
  const { uuid } = data;

  try {
    const response = await getProjectsHandler({ getUserProjectsGateway }, uuid);
    return response;
  } catch (error) {
    console.log({ error });
  }
};
