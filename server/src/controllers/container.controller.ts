import { Request, Response } from "express";
import {
  getContainersGateway,
  setContainerGateway,
} from "../gateways/container.gateway.js";
import {
  createContainerHandler,
  getContainersHandler,
} from "../handlers/containerHandlers.js";
import Container from "../entities/containerEntity.js";

export const setContainer = async (req: Request, res: Response) => {
  const {
    containerId,
    containerName,
    position,
    createdAt,
    modifiedAt,
    projectId,
  } = req.body;

  try {
    const response = await createContainerHandler(setContainerGateway, {
      containerId,
      containerName,
      position,
      createdAt,
      modifiedAt,
      projectId,
    });

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

export const setContainerSocketHandler = async (data: Container) => {
  const {
    containerId,
    containerName,
    position,
    createdAt,
    modifiedAt,
    projectId,
  } = data;

  try {
    const response = await createContainerHandler(setContainerGateway, {
      containerId,
      containerName,
      position,
      createdAt,
      modifiedAt,
      projectId,
    });

    return response;
  } catch (error) {
    console.log({ error });
    return error;
  }
};

export const getContainersSocketController = async (projectId: string) => {
  try {
    const response = await getContainersHandler(
      getContainersGateway,
      projectId
    );

    return response;
  } catch (error) {
    console.log({ error });
  }
};
