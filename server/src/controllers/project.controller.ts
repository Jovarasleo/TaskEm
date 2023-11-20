import {
  getUserProjectsGateway,
  setProjectGateway,
  deleteProjectGateway,
} from "../gateways/project.gateway.js";
import { Request, Response } from "express";
import {
  createProjectHandler,
  deleteProjectHandler,
  getProjectsHandler,
} from "../handlers/projectHandlers.js";
import { ISession } from "../server.js";
import Project from "../entities/projectEntity.js";

export const getProjects = async (req: Request, res: Response) => {
  const { userId } = req.session as ISession;

  try {
    const response = await getProjectsHandler(getUserProjectsGateway, userId);
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error: get projects" });
  }
};

export const setProject = async (req: Request, res: Response) => {
  const { projectId, projectName } = req.body;
  const { userId } = req.session as ISession;

  try {
    const response = await createProjectHandler(setProjectGateway, {
      projectId,
      projectName,
      userId,
    });
    res.status(200).send(response);
  } catch (error) {
    console.log({ error });
    res.status(500).send({ error: "Internal Server Error: get projects" });
  }
};

export const setProjectSocketController = async (
  data: Project,
  userId: string
) => {
  const { projectId, projectName } = data;

  try {
    const response = await createProjectHandler(setProjectGateway, {
      projectId,
      projectName,
      userId,
    });
    return response;
  } catch (error) {
    console.log({ error });
  }
};

export const getProjectsSocketController = async (userId: string) => {
  try {
    const response = await getProjectsHandler(getUserProjectsGateway, userId);
    return response;
  } catch (error) {
    console.log({ error });
  }
};

export const deleteProjectSocketController = async (data: {
  projectId: string;
}) => {
  const { projectId } = data;
  try {
    const response = await deleteProjectHandler(
      deleteProjectGateway,
      projectId
    );

    return response;
  } catch (error) {
    console.log({ error });
  }
};
