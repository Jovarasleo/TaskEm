import Task, { ITask } from "../entities/taskEntity";

type SetTaskGateway = ({
  taskId,
  projectId,
  containerId,
  value,
  count,
  position,
}: ITask) => Promise<{ success: boolean; message: string[] }>;

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
