import { Request, Response } from "express";
import Project from "../entities/projectEntity.js";
import { deleteContainersByProjectGateway } from "../gateways/container.gateway.js";
import {
  deleteProjectGateway,
  getUserProjectsGateway,
  setProjectGateway,
} from "../gateways/project.gateway.js";
import { deleteTasksByProjectGateway } from "../gateways/task.gateway.js";
import { deleteContainersByProjectHandler } from "../handlers/containerHandlers.js";
import {
  createProjectHandler,
  deleteProjectHandler,
  getProjectsHandler,
} from "../handlers/projectHandlers.js";
import { deleteTasksByProjectHandler } from "../handlers/taskHandlers.js";
import { ISession } from "../server.js";
import { createProjectHandlerNew } from "../domainHandlers/projectHandlers.js";
import { WebSocket } from "ws";

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
      ownerId: userId,
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
      ownerId: userId,
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
    await deleteTasksByProjectHandler(deleteTasksByProjectGateway, projectId);
    await deleteContainersByProjectHandler(
      deleteContainersByProjectGateway,
      projectId
    );

    const response = await deleteProjectHandler(
      deleteProjectGateway,
      projectId
    );

    return response;
  } catch (error) {
    console.log({ error });
  }
};

interface createProjectRequestData {
  userId: string;
  projectId: string;
  projectName: string;
}

export const createProjectSocketController = async (
  requestData: createProjectRequestData,
  client: WebSocket
) => {
  try {
    const handleRequest = await createProjectHandlerNew(
      requestData.projectId,
      requestData.projectName,
      requestData.userId
    );

    if (handleRequest.success) {
      return client.send(
        JSON.stringify({
          type: "project/serverCreateProject",
          payload: handleRequest,
        })
      );
    }

    if (!handleRequest.success) {
      return client.send(
        JSON.stringify({
          type: "error/serverError",
          payload: { error: "Something went wrong" },
        })
      );
    }
  } catch (error) {
    client.send(
      JSON.stringify({
        type: "error/serverError",
        payload: { error: "Internal Server Error" },
      })
    );
  }
};
