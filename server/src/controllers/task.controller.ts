import { setTaskGateway, getTasksGateway } from "../gateways/task.gateway";
import { Request, Response } from "express";
import { createTaskHandler, getTasksHandler } from "../handlers/taskHandlers";

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

export const setTaskSocketController = async (data: any) => {
  const { taskId, projectId, containerId, value, count, position } = data;

  try {
    await createTaskHandler(setTaskGateway, {
      taskId,
      projectId,
      containerId,
      value,
      count,
      position,
    });
  } catch (error) {
    console.log({ error });
  }
};

export const getTasksSocketController = async (projectId: any) => {
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
