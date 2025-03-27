import { Task } from "../model/task";

interface Props {
  state: Task[];
  toContainerId: string;
  fromContainerId: string;
  toIndex: number;
  fromIndex: number;
  taskId: string;
}

export const getTaskPosition = ({
  state,
  toContainerId,
  fromContainerId,
  toIndex,
  fromIndex,
  taskId,
}: Props) => {
  if (!toContainerId || !fromContainerId) return;
  if (toContainerId === fromContainerId && toIndex === fromIndex) return;

  const tasksInContainer = state.filter((task) => task.containerId === toContainerId);

  const taskAbove = tasksInContainer[toIndex - 1]?.position;
  const taskBelow = tasksInContainer[toIndex + 1]?.position;
  const taskAtIndex = tasksInContainer[toIndex]?.position;

  const moveUp = toIndex < fromIndex;
  const moveDn = toIndex > fromIndex;

  const sameContainer = toContainerId === fromContainerId;

  const newPosition = (position: number) => {
    if (!tasksInContainer.length) {
      return position;
    }
    //first task in container
    if (!taskAbove && taskAtIndex) {
      return taskAtIndex - 1000;
    }
    //insert in between
    if (sameContainer && moveUp && taskAbove && taskAtIndex) {
      return (taskAtIndex + taskAbove) / 2;
    }
    //insert in between
    if (sameContainer && moveDn && taskAtIndex && taskBelow) {
      return (taskAtIndex + taskBelow) / 2;
    }
    //last task in another container
    if (taskAbove && !taskBelow && !taskAtIndex) {
      return taskAbove + 1000;
    }
    //last task in current container
    if (!sameContainer && taskAbove && !taskBelow && taskAtIndex) {
      return (taskAtIndex + taskAbove) / 2;
    }
    //last task in current container
    if (sameContainer && taskAbove && !taskBelow && taskAtIndex) {
      return taskAtIndex + 1000;
    }
    //insert between tasks in another container
    if (!sameContainer && taskAbove && taskBelow && taskAtIndex) {
      return (taskAtIndex + taskAbove) / 2;
    }

    return position;
  };

  const currentTask = state.find((task) => task.taskId === taskId);

  if (!currentTask) {
    return;
  }

  return {
    ...currentTask,
    position: Math.floor(newPosition(currentTask.position)),
    containerId: toContainerId,
  };
};
