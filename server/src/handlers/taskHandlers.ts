import { RowDataPacket } from "mysql2";
import Task, { ITask } from "../entities/taskEntity";

type SetTaskGateway = ({
  taskId,
  projectId,
  containerId,
  value,
  count,
  position,
}: ITask) => Promise<{ success: boolean; message: string[] }>;

type GetTasksGateway = (projectId: string) => Promise<{
  success: boolean;
  message: string[];
  data: RowDataPacket[];
}>;

type GetSingleTaskGateway = (taskId: string) => Promise<{
  success: boolean;
  message: string[];
  data: RowDataPacket[];
}>;

type UpdateTaskPositionGateway = ({
  taskId,
  containerId,
  position,
}: {
  taskId: string;
  containerId: string;
  position: bigint;
}) => Promise<{ success: boolean; message: string[] }>;

type DeleteTaskGateway = (
  taskId: string
) => Promise<{ success: boolean; message: string[] }>;

export async function createTaskHandler(
  setTaskGateway: SetTaskGateway,
  { taskId, projectId, containerId, value, count, position }: ITask
) {
  const task = new Task(taskId, projectId, containerId, value, count, position);
  const validatedTask = await task.validate();

  if (validatedTask.error) {
    return { success: false, message: validatedTask.error };
  }

  const newTask = await setTaskGateway(validatedTask);
  return newTask;
}

export async function getTasksHandler(
  getTasksGateway: GetTasksGateway,
  projectId: string
) {
  const tasks = await getTasksGateway(projectId);

  if (!tasks.success) {
    return { success: false, error: "", data: null };
  }

  return tasks;
}

export async function getSingleTaskHandler(
  getSingleTaskGateway: GetSingleTaskGateway,
  taskId: string
) {
  const task = await getSingleTaskGateway(taskId);

  if (!task.success) {
    return { success: false, error: "", data: null };
  }

  return task;
}

export async function updateTaskHandler(
  updateTaskPositionGateway: UpdateTaskPositionGateway,
  {
    taskId,
    containerId,
    position,
  }: { taskId: string; containerId: string; position: bigint }
) {
  const task = await updateTaskPositionGateway({
    taskId,
    containerId,
    position,
  });

  if (!task.success) {
    return { success: false, error: "", data: null };
  }

  return task;
}

export async function deleteTaskHandler(
  deleleTaskGateway: DeleteTaskGateway,
  taskId: string
) {
  const task = await deleleTaskGateway(taskId);

  if (!task.success) {
    return { success: false, error: "", data: null };
  }

  return task;
}
