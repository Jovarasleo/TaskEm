import { RowDataPacket } from "mysql2";
import Container, { IContainer } from "../entities/containerEntity";

type SetContainerGateway = ({
  containerId,
  containerName,
  position,
  projectId,
}: IContainer) => Promise<string>;

type GetContainersGateway = (projectId: string) => Promise<RowDataPacket[]>;

export async function createContainerHandler(
  setContainerGateway: SetContainerGateway,
  { containerId, containerName, position, projectId }: IContainer
) {
  const container = new Container(
    containerId,
    containerName,
    position,
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
  const containers = await getContainersGateway(projectId);
  return containers;
}
