import Container, { IContainer } from "../entities/containerEntity.js";
import { IProject } from "../entities/projectEntity.js";
import { IUser } from "../entities/userEntity.js";
import { accessLayer } from "../respositories/accessLayer.js";

export async function createContainerHandler(
  containerId: IContainer["containerId"],
  containerName: IContainer["containerName"],
  position: IContainer["position"],
  createdAt: IContainer["createdAt"],
  modifiedAt: IContainer["modifiedAt"],
  projectId: IContainer["projectId"],
  userId: IUser["uuid"]
) {
  const hasAccess = await accessLayer.project.hasAccessToProject(userId, projectId);
  if (!hasAccess) {
    return {
      success: false,
      error: "User has no access to the project",
      data: null,
    };
  }

  const container = new Container(containerId, containerName, position, createdAt, modifiedAt, projectId);
  const validatedContainer = await container.validate();

  if (validatedContainer.error) {
    return {
      success: false,
      error: validatedContainer.error,
      data: null,
    };
  }

  const createdContainerId = await accessLayer.container.createContainer(validatedContainer);

  if (!createdContainerId) {
    return { success: false, error: "Something went wrong", data: null };
  }

  return { success: true, error: null, data: createdContainerId };
}

export async function getProjectContainersHandler(projectId: IProject["projectId"], userId: IUser["uuid"]) {
  const hasAccess = await accessLayer.project.hasAccessToProject(userId, projectId);
  if (!hasAccess) {
    return {
      success: false,
      error: "User has no access to the project",
      data: null,
    };
  }

  const containers = await accessLayer.container.getProjectContainers(projectId);

  return {
    success: true,
    error: null,
    data: containers,
  };
}
