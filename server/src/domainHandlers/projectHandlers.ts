import Project, { IProject } from "../entities/projectEntity.js";
import { accessLayer } from "../respositories/accessLayer.js";

export async function createProjectHandlerNew(
  projectId: string,
  projectName: string,
  userId: string
) {
  const project = new Project(projectId, projectName, userId);
  const validatedProject = await project.validateProject();

  if (validatedProject.error) {
    return { success: false, error: validatedProject.error, data: null };
  }

  const createdProjectId = await accessLayer.project.createProject(project);
  if (!createdProjectId) {
    return { success: false, error: "failed to create project", data: null };
  }

  return {
    success: true,
    error: null,
    data: createdProjectId,
  };
}
