import Project, { IProject } from "../entities/projectEntity";

type SetProjectGateway = ({
  projectId,
  projectName,
  userId,
}: IProject) => Promise<string>;

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
  { getUserProjectsGateway }: any,
  userId: string
) {
  const project = getUserProjectsGateway(userId);
  return project;
}

export async function deleteProjectHandler(
  { deleteProjectGateway }: any,
  projectId: string
) {
  const project = deleteProjectGateway(projectId);
  return project;
}
