import { Request, Response } from "express";
import { setContainerGateway } from "../gateways/container.gateway";
import { createContainer } from "../handlers/containerHandlers";

export const setContainer = async (req: Request, res: Response) => {
  const { containerId, containerName, position, projectId, uuid } = req.body;

  try {
    const projects = createContainer(setContainerGateway, {
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
