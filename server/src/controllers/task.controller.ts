import {
  setTaskGateway,
  getTasksGateway,
  updateTaskPositionGateway,
  deleteTaskGateway,
  getSingleTaskGateway,
} from "../gateways/task.gateway";
import { Request, Response } from "express";
import {
  createTaskHandler,
  deleteTaskHandler,
  getSingleTaskHandler,
  getTasksHandler,
  updateTaskHandler,
} from "../handlers/taskHandlers";
import Task from "../entities/taskEntity";

export const setTask = async (req: Request, res: Response) => {
  const { taskId, projectId, containerId, value, count, position } = req.body;

  try {
    const response = await createTaskHandler(setTaskGateway, {
      taskId,
      projectId,
      containerId,
      value,
      count,
      position,
    });

    if (!response.success) {
      return res.status(400).send(response);
    }

    res.status(200).send(response);
  } catch (error) {
    console.log({ error });
    res.status(500).send({ error: "Internal Server Error: get projects" });
  }
};

export const getTasks = async (req: Request, res: Response) => {
  const { projectId } = req.body;

  try {
    const response = await getTasksHandler(getTasksGateway, projectId);

    if (!response.success) {
      return res.status(400).send(response);
    }

    res.status(200).send(response);
  } catch (error) {
    console.log({ error });
    res.status(500).send({ error: "Internal Server Error: get projects" });
  }
};

export const setTaskSocketController = async (data: Task) => {
  const { taskId, projectId, containerId, value, count, position } = data;

  try {
    const reponse = await createTaskHandler(setTaskGateway, {
      taskId,
      projectId,
      containerId,
      value,
      count,
      position,
    });

    return reponse;
  } catch (error) {
    console.log({ error });
  }
};

export const getTasksSocketController = async (projectId: string) => {
  try {
    const response = await getTasksHandler(getTasksGateway, projectId);

    if (!response.success) {
      return new Error("can't return tasks");
    }

    return response;
  } catch (error) {
    console.log({ error });
  }
};

export const getSingleTaskSocketController = async (taskId: string) => {
  try {
    const response = await getSingleTaskHandler(getSingleTaskGateway, taskId);

    if (!response.success) {
      return {
        error: new Error("can't retrieve task"),
        success: false,
        data: null,
      };
    }

    return response;
  } catch (error) {
    console.log({ error });
  }
};

export const updateTaskPositionSocketController = async (data: {
  taskId: string;
  containerId: string;
  position: bigint;
}) => {
  const { taskId, containerId, position } = data;

  try {
    const reponse = await updateTaskHandler(updateTaskPositionGateway, {
      taskId,
      containerId,
      position,
    });

    return reponse;
  } catch (error) {
    console.log({ error });
  }
};

export const deleteTaskSocketController = async (data: { taskId: string }) => {
  const { taskId } = data;

  try {
    const reponse = await deleteTaskHandler(deleteTaskGateway, taskId);

    return reponse;
  } catch (error) {
    console.log({ error });
  }
};
