import Project, { IProject } from "../entities/projectEntity.js";
import { IUser } from "../entities/userEntity.js";
import { accessLayer } from "../respositories/accessLayer.js";

export async function createProjectHandler(projectId: IProject["projectId"], projectName: IProject["projectName"], userId: IUser["uuid"]) {
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

export async function getUserProjectsHandler(userId: IUser["uuid"]) {
  const projects = await accessLayer.project.getUserProjects(userId);

  return {
    success: true,
    error: null,
    data: projects,
  };
}

export async function deleteProjectHandler(projectId: IProject["projectId"], userId: IUser["uuid"]) {
  const hasAccess = await accessLayer.project.hasAccessToProject(userId, projectId);

  if (!hasAccess) {
    return {
      success: false,
      error: "User has no access to the project",
      data: null,
    };
  }

  await accessLayer.task.deleteProjectTasks(projectId);
  await accessLayer.container.deleteProjectContainers(projectId);
  await accessLayer.project.deleteProject(projectId);

  return {
    success: true,
    error: null,
    data: projectId,
  };
}
