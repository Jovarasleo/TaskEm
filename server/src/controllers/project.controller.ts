import { WebSocket } from "ws";
import { createProjectHandler, deleteProjectHandler, getUserProjectsHandler } from "../domainHandlers/projectHandlers.js";
import { IContainer } from "../entities/containerEntity.js";
import { ITask } from "../entities/taskEntity.js";
import { accessLayer } from "../respositories/accessLayer.js";
import { IProject } from "../entities/projectEntity.js";

interface createProjectRequestData {
  userId: string;
  projectId: string;
  projectName: string;
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

    client.send(
      JSON.stringify({
        type: "project/serverDeleteProject",
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

export async function createProjectSocketController(requestData: createProjectRequestData, client: WebSocket) {
  try {
    const response = await createProjectHandler(requestData.projectId, requestData.projectName, requestData.userId);

    if (!response.success) {
      return client.send(
        JSON.stringify({
          type: "error/serverError",
          payload: response.error,
        })
      );
    }

    client.send(
      JSON.stringify({
        type: "project/serverCreateProject",
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

      userContainers.concat(containerResponse);
      userTasks.concat(taskResponse);
    }

    client.send(
      JSON.stringify({
        type: "task/serverLoadTasks",
        payload: userTasks,
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
        type: "project/serverLoadProjects",
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
