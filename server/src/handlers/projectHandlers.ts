import { RowDataPacket } from "mysql2";
import Project, { IProject } from "../entities/projectEntity.js";

type SetProjectGateway = ({
  projectId,
  projectName,
  ownerId,
}: IProject) => Promise<string>;

type GetUserProjectsGateway = (
  userId: string
) => Promise<RowDataPacket[] | undefined>;

type DeleteProjectGateway = (projectId: string) => Promise<{
  success: boolean;
  message: string[];
  data: RowDataPacket[];
}>;

export async function createProjectHandler(
  setProjectGateway: SetProjectGateway,
  { projectId, projectName, ownerId }: IProject
) {
  const project = new Project(projectId, projectName, ownerId);
  const validatedProject = await project.validateProject();

  if (validatedProject.error) {
    return { error: validatedProject.error };
  }

  const newProject = await setProjectGateway({ ...validatedProject, ownerId });
  return newProject;
}

export async function getProjectsHandler(
  getUserProjectsGateway: GetUserProjectsGateway,
  userId: string
) {
  const project = getUserProjectsGateway(userId);
  return project;
}

export async function deleteProjectHandler(
  deleteProjectGateway: DeleteProjectGateway,
  projectId: string
) {
  const project = deleteProjectGateway(projectId);
  return project;
}
