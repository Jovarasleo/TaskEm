import { RowDataPacket } from "mysql2";
import Container, { IContainer } from "../entities/containerEntity.js";

type SetContainerGateway = ({
  containerId,
  containerName,
  position,
  projectId,
}: IContainer) => Promise<string>;

type GetContainersGateway = (projectId: string) => Promise<RowDataPacket[]>;

type DeleteContainerGateway = (projectId: string) => Promise<{
  success: boolean;
  message: string[];
  data: RowDataPacket[];
}>;

export async function createContainerHandler(
  setContainerGateway: SetContainerGateway,
  {
    containerId,
    containerName,
    position,
    createdAt,
    modifiedAt,
    projectId,
  }: IContainer
) {
  const container = new Container(
    containerId,
    containerName,
    position,
    createdAt,
    modifiedAt,
    projectId
  );
  const validatedContainer = await container.validate();

  if (validatedContainer.error) {
    return { error: validatedContainer.error };
  }

  const newContainer = await setContainerGateway(validatedContainer);
  return newContainer;
}

export async function getContainersHandler(
  getContainersGateway: GetContainersGateway,
  projectId: string
) {
  return await getContainersGateway(projectId);
}

export async function deleteContainerHandler(
  deleteContainerGateway: DeleteContainerGateway,
  containerId: string
) {
  return deleteContainerGateway(containerId);
}

export async function deleteContainersByProjectHandler(
  deleteContainersByProjectGateway: DeleteContainerGateway,
  projectId: string
) {
  return deleteContainersByProjectGateway(projectId);
}
