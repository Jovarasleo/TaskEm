import { RowDataPacket } from "mysql2";
import Project, { IProject } from "../entities/projectEntity";

type SetProjectGateway = ({
  projectId,
  projectName,
  userId,
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
  { projectId, projectName, userId }: IProject
) {
  const project = new Project(projectId, projectName);
  const validatedProject = await project.validateProject();

  if (validatedProject.error) {
    return { error: validatedProject.error };
  }

  const newProject = await setProjectGateway({ ...validatedProject, userId });
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
