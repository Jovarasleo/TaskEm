import Container, { IContainer } from "../entities/containerEntity";

type SetContainerGateway = ({
  containerId,
  containerName,
  position,
  projectId,
}: IContainer) => Promise<string>;

export async function createContainer(
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
