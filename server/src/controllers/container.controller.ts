import { Request, Response } from "express";
import {
  getContainersGateway,
  setContainerGateway,
} from "../gateways/container.gateway";
import {
  createContainerHandler,
  getContainersHandler,
} from "../handlers/containerHandlers";

export const setContainer = async (req: Request, res: Response) => {
  const { containerId, containerName, position, projectId } = req.body;

  try {
    const projects = createContainerHandler(setContainerGateway, {
      containerId,
      containerName,
      position,
      projectId,
    });
    const response = await projects;
    res.status(200).send(response);
  } catch (error) {
    console.log({ error });
    res.status(500).send({ error: "Internal Server Error: get projects" });
  }
};

export const getContainers = async (req: Request, res: Response) => {
  const { projectId } = req.body;

  try {
    const containers = getContainersHandler(getContainersGateway, projectId);
    const response = await containers;
    res.status(200).send(response);
  } catch (error) {
    console.log({ error });
    res.status(500).send({ error: "Internal Server Error: get projects" });
  }
};

export const getContainersSocketController = async (data: any) => {
  const { projectId } = data;

  try {
    const containers = await getContainersHandler(
      getContainersGateway,
      projectId
    );

    return containers;
  } catch (error) {
    console.log({ error });
  }
};
