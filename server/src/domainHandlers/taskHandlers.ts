import Task, { ITask } from "../entities/taskEntity.js";
import { accessLayer } from "../respositories/accessLayer.js";
import { IUser } from "../entities/userEntity.js";
import { IProject } from "../entities/projectEntity.js";

export async function createTaskHandler(
  taskId: ITask["taskId"],
  projectId: ITask["projectId"],
  containerId: ITask["containerId"],
  value: ITask["value"],
  count: ITask["count"],
  position: ITask["position"],
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

  const task = new Task(taskId, projectId, containerId, value, count, position);
  const validatedTask = await task.validate();

  if (validatedTask.error) {
    return { success: false, error: validatedTask.error, data: null };
  }

  const createdTaskId = await accessLayer.task.createTask(task);
  if (!createdTaskId) {
    return { success: false, error: "Something went wrong", data: null };
  }

  return { success: true, error: null, data: createdTaskId };
}

export async function getProjectTasksHandler(userId: IUser["uuid"], projectId: IProject["projectId"]) {
  const hasAccess = await accessLayer.project.hasAccessToProject(userId, projectId);

  if (!hasAccess) {
    return {
      success: false,
      error: "User has no access to the project",
      data: null,
    };
  }

  const tasks = await accessLayer.task.getProjectTasks(projectId);
  return { success: true, error: null, data: tasks };
}

export async function getSingleTaskHandler(taskId: string) {
  const task = await accessLayer.task.getSingleProjectTask(taskId);
  if (!task) {
    return { success: false, error: "Something went wrong", data: null };
  }

  return { success: true, error: null, data: task };
}

export async function updateTaskPositionHandler(
  taskId: ITask["projectId"],
  containerId: ITask["containerId"],
  position: ITask["position"],
  projectId: ITask["projectId"],
  userId: IUser["uuid"]
) {
  const hasAccess = await accessLayer.project.hasAccessToProject(userId, projectId);

  if (!hasAccess) {
    return {
      success: false,
      error: "User has no access to the task",
      data: null,
    };
  }

  const updatedTaskId = await accessLayer.task.updateTaskPosition({
    taskId,
    containerId,
    position,
  });

  if (!updatedTaskId) {
    return { success: false, error: "Something went wrong", data: null };
  }

  return {
    success: true,
    error: null,
    data: updatedTaskId,
  };
}

export async function updateTaskValueHandler(
  taskId: ITask["projectId"],
  value: ITask["value"],
  projectId: ITask["projectId"],
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

  const updatedTaskId = await accessLayer.task.updateTaskValue({
    taskId,
    value,
  });

  if (!updatedTaskId) {
    return { success: false, error: "Something went wrong", data: null };
  }

  return {
    success: true,
    error: null,
    data: updatedTaskId,
  };
}

export async function deleteTaskHandler(projectId: ITask["projectId"], taskId: ITask["taskId"], userId: IUser["uuid"]) {
  const hasAccess = await accessLayer.project.hasAccessToProject(userId, projectId);

  if (!hasAccess) {
    return {
      success: false,
      error: "User has no access to the task",
      data: null,
    };
  }
  const deletedTaskId = await accessLayer.task.deleteTask(taskId);

  if (!deletedTaskId) {
    return { success: false, error: "Something went wrong", data: null };
  }

  return { success: false, error: null, data: deletedTaskId };
}

export async function deleteProjectTasks(projectId: IProject["projectId"]) {
  const deletedProjectId = await accessLayer.task.deleteProjectTasks(projectId);

  if (!deletedProjectId) {
    return { success: false, error: "Something went wrong", data: null };
  }

  return {
    success: true,
    error: null,
    data: deletedProjectId,
  };
}
