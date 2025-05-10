import { DragCancelEvent, DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core";
import type { AppDispatch } from "../../../store/configureStore";
import { Task, TaskContainer } from "../model/task";
import { useState } from "react";
import { clientMoveTask } from "../../../store/slices/taskReducer";
import { getTaskPosition } from "../util/getTaskPosition";

export const useDnd = (
  dispatch: AppDispatch,
  tasks: Task[],
  containers: TaskContainer[],
  setTemporaryTasks: (tasks: Task[]) => void
) => {
  const [activeTask, setActiveTask] = useState<Task | undefined>();

  function handleDragCancel(event: DragCancelEvent) {
    const { active, over } = event;

    // if (active.id !== over?.id) {
    //   const ids = tasks.map((task) => task.taskId);
    //   const oldIndex = ids.indexOf(active.id);
    //   const newIndex = ids.indexOf(over.id);

    //   return arrayMove(tasks, oldIndex, newIndex);
    // }

    console.log({ active, over, event });

    // const updatedTask = getTaskPosition({
    //   state: tasks,
    //   toContainerId: container,
    //   fromContainerId: dragItemPosition.current?.container,
    //   toIndex: index,
    //   fromIndex: dragItemPosition.current?.index,
    //   taskId: savedTaskId.current,
    // });

    // if (!updatedTask) {
    //   return;
    // }

    // dispatch(clientMoveTask(updatedTask));
    setActiveTask(undefined);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTask(undefined);
    const { active, over } = event;

    const taskId = active.id;
    const container = containers.find((container) => container.containerId === over?.id);
    const containerId = over?.data.current?.sortable.containerId ?? container?.containerId;

    if (!over || !containerId) {
      return;
    }

    const currentTask = tasks.find((task) => task.taskId === taskId);

    const ids = tasks
      ?.filter((task) => task.containerId === containerId)
      .map((task) => task.taskId);

    const oldIndex = ids.indexOf(taskId);
    const nextIndex = ids.indexOf(over.id);
    const newIndex = nextIndex < 0 ? ids.length : nextIndex;

    if (oldIndex === newIndex) {
      return;
    }

    const updatedTask = getTaskPosition({
      state: tasks,
      toContainerId: containerId,
      fromContainerId: currentTask?.containerId as string,
      toIndex: newIndex,
      fromIndex: oldIndex,
      taskId: currentTask?.taskId as string,
    });

    console.log({ oldIndex, newIndex });
    if (!updatedTask) return;
    setTemporaryTasks((prevState) => {
      const newTasksArray = prevState.filter((task: Task) => task.taskId !== updatedTask.taskId);

      return [...newTasksArray, updatedTask].sort((a, b) => a.position - b.position);
    });

    dispatch(clientMoveTask(updatedTask));
  }

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const { id } = active;

    setActiveTask(tasks.find((task) => task.taskId === id));
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;

    const taskId = active.id;
    const container = containers.find((container) => container.containerId === over?.id);
    const containerId = over?.data.current?.sortable.containerId ?? container?.containerId;

    if (!over || !containerId) {
      return;
    }

    const currentTask = tasks.find((task) => task.taskId === taskId);

    const ids = tasks
      ?.filter((task) => task.containerId === containerId)
      .map((task) => task.taskId);

    const oldIndex = ids.indexOf(taskId);
    const nextIndex = ids.indexOf(over.id);
    const newIndex = nextIndex < 0 ? ids.length : nextIndex;

    if (containerId === currentTask?.containerId && oldIndex === newIndex) {
      console.log("if block");
      return;
    }

    console.log({ containerId, oldIndex, newIndex });

    console.log("after if block");

    const updatedTask = getTaskPosition({
      state: tasks,
      toContainerId: containerId,
      fromContainerId: currentTask?.containerId as string,
      toIndex: newIndex,
      fromIndex: oldIndex,
      taskId: currentTask?.taskId as string,
    });

    if (!updatedTask) {
      return;
    }

    setTemporaryTasks((prevState: Task[]) => {
      const newTasksArray = prevState.filter((task: Task) => task.taskId !== updatedTask.taskId);

      return [...newTasksArray, updatedTask].sort((a, b) => a.position - b.position);
    });
  }

  return {
    activeTask,
    handleDragCancel,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
};
