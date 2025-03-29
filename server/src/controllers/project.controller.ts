import { WebSocket } from "ws";
import { createProjectHandler, deleteProjectHandler, getUserProjectsHandler } from "../domainHandlers/projectHandlers.js";
import { IContainer } from "../entities/containerEntity.js";
import { ITask } from "../entities/taskEntity.js";
import { accessLayer } from "../respositories/accessLayer.js";
import { IProject } from "../entities/projectEntity.js";
import { IUser } from "../entities/userEntity.js";
import { createContainerHandler } from "../domainHandlers/containerHandlers.js";

interface createProjectRequestData {
  project: {
    projectId: string;
    projectName: string;
  };
  containers: {
    containerId: IContainer["containerId"];
    containerName: IContainer["containerName"];
    position: IContainer["position"];
    createdAt: IContainer["createdAt"];
    modifiedAt: IContainer["modifiedAt"];
    projectId: IContainer["projectId"];
  }[];
  userId: IUser["uuid"];
}

interface deleteProjectRequestData {
  userId: string;
  projectId: string;
}

export async function getUserProjectsSocketController(userId: string, client: WebSocket) {
  try {
    const response = await getUserProjectsHandler(userId);

    if (!response.success) {
      client.send(
        JSON.stringify({
          type: "error/serverError",
          payload: response.error,
        })
      );
    }

    client.send(
      JSON.stringify({
        type: "project/serverLoadProjects",
        payload: response.data,
      })
    );
  } catch (error) {
    console.error(error);

    client.send(
      JSON.stringify({
        type: "error/serverError",
        payload: "Internal Server Error",
      })
    );
  }
}

export async function deleteProjectSocketController(requestData: deleteProjectRequestData, client: WebSocket) {
  try {
    const response = await deleteProjectHandler(requestData.projectId, requestData.userId);

    if (!response.success) {
      return client.send(
        JSON.stringify({
          type: "error/serverError",
          payload: response.error,
        })
      );
    }
  } catch (error) {
    console.error(error);

    client.send(
      JSON.stringify({
        type: "error/serverError",
        payload: "Internal Server Error",
      })
    );
  }
}

export async function createProjectSocketController(requestData: createProjectRequestData, client: WebSocket) {
  try {
    const projectResponse = await createProjectHandler(requestData.project.projectId, requestData.project.projectName, requestData.userId);

    for (const container of requestData.containers) {
      const containerHandlerResponse = await createContainerHandler(
        container.containerId,
        container.containerName,
        container.position,
        container.createdAt,
        container.modifiedAt,
        container.projectId,
        requestData.userId
      );

      if (!containerHandlerResponse.success) {
        return client.send(
          JSON.stringify({
            type: "error/serverError",
            payload: projectResponse.error,
          })
        );
      }
    }

    if (!projectResponse.success) {
      return client.send(
        JSON.stringify({
          type: "error/serverError",
          payload: projectResponse.error,
        })
      );
    }
  } catch (error) {
    console.error(error);

    client.send(
      JSON.stringify({
        type: "error/serverError",
        payload: "Internal Server Error",
      })
    );
  }
}

export async function syncUserProjectData(userId: string, client: WebSocket) {
  try {
    const response = await getUserProjectsHandler(userId);

    if (!response.success) {
      client.send(
        JSON.stringify({
          type: "error/serverError",
          payload: response.error,
        })
      );
    }

    const userProjects: IProject[] = response.data;
    const userContainers: IContainer[] = [];
    const userTasks: ITask[] = [];

    for (const project of userProjects) {
      const containerResponse = await accessLayer.container.getProjectContainers(project.projectId);
      const taskResponse = await accessLayer.task.getProjectTasks(project.projectId);

      userContainers.push(...containerResponse);
      userTasks.push(...taskResponse);
    }

    client.send(
      JSON.stringify({
        type: "project/serverLoadProjects",
        payload: userProjects,
      })
    );

    client.send(
      JSON.stringify({
        type: "container/serverLoadContainers",
        payload: userContainers,
      })
    );

    client.send(
      JSON.stringify({
        type: "task/serverLoadTasks",
        payload: userTasks,
      })
    );
  } catch (error) {
    console.error(error);

    client.send(
      JSON.stringify({
        type: "error/serverError",
        payload: "Internal Server Error",
      })
    );
  }
}
