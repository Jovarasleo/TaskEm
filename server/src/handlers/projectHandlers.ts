import Project, { IProject } from "../entities/projectEntity";

type SetProjectGateway = ({
  projectId,
  projectName,
  uuid,
}: IProject) => Promise<string>;

export async function createProject(
  setProjectGateway: SetProjectGateway,
  { projectId, projectName, uuid }: IProject
) {
  const project = new Project(projectId, projectName);
  const validatedProject = await project.validateProject();

  if (validatedProject.error) {
    return { error: validatedProject.error };
  }

  const newProject = await setProjectGateway({ ...validatedProject, uuid });
  return newProject;
}

export async function getProjects(
  { getUserProjectsGateway }: any,
  uuid: string
) {
  const project = getUserProjectsGateway(uuid);
  return project;
}
