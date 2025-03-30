import { WebSocket } from "ws";
import { IContainer } from "../entities/containerEntity.js";
import { IUser } from "../entities/userEntity.js";
import { createContainerHandler } from "../domainHandlers/containerHandlers.js";

interface createContainerRequestData {
  containerId: IContainer["containerId"];
  containerName: IContainer["containerName"];
  position: IContainer["position"];
  createdAt: IContainer["createdAt"];
  modifiedAt: IContainer["modifiedAt"];
  projectId: IContainer["projectId"];
  userId: IUser["uuid"];
}

export const createContainerSocketController = async (requestData: createContainerRequestData, client: WebSocket) => {
  try {
    const { containerId, containerName, position, createdAt, modifiedAt, projectId, userId } = requestData;
    if (!containerId || !containerName || !position || !createdAt || !modifiedAt || !projectId || !userId) {
      return client.send(
        JSON.stringify({
          type: "error/serverError",
          payload: "Missing request data",
        })
      );
    }

    await createContainerHandler(containerId, containerName, position, createdAt, modifiedAt, projectId, userId);
  } catch (error) {
    console.error(error);

    client.send(
      JSON.stringify({
        type: "error/serverError",
        payload: "Internal Server Error",
      })
    );
  }
};
