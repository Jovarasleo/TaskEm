import {
  getUserProjectsGateway,
  setProjectGateway,
} from "../gateways/project.gateway";
import { Request, Response, NextFunction } from "express";
import {
  createProjectHandler,
  getProjectsHandler,
} from "../handlers/projectHandlers";
import { ISession } from "../server";

export const getProjects = async (req: Request, res: Response) => {
  const { userId } = req.session as ISession;

  try {
    const response = await getProjectsHandler(
      { getUserProjectsGateway },
      userId
    );
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

export const setProjectSocketController = async (data: any, userId: string) => {
  const { projectId, projectName, uuid } = data;

  try {
    const response = await createProjectHandler(setProjectGateway, {
      projectId,
      projectName,
      userId,
    });
  } catch (error) {
    console.log({ error });
  }
};

export const getProjectsSocketController = async (
  data: any,
  userId: string
) => {
  try {
    const response = await getProjectsHandler(
      { getUserProjectsGateway },
      userId
    );
    return response;
  } catch (error) {
    console.log({ error });
  }
};
