import { setTaskGateway } from "../gateways/task.gateway";
import { Request, Response } from "express";
import { createTaskHandler } from "../handlers/taskHandlers";

export const setTask = async (req: Request, res: Response) => {
  const { taskId, projectId, containerId, value, count, position } = req.body;

  try {
    const projects = createTaskHandler(setTaskGateway, {
      taskId,
      projectId,
      containerId,
      value,
      count,
      position,
    });

    const response = await projects;

    if (!response.success) {
      return res.status(400).send(response);
    }

    res.status(200).send(response);
  } catch (error) {
    console.log({ error });
    res.status(500).send({ error: "Internal Server Error: get projects" });
  }
};
