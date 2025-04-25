import { DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core";
import type { AppDispatch } from "../../../store/configureStore";
import { Task, TaskContainer } from "../model/task";
import { arrayMove } from "@dnd-kit/sortable";
import { useState } from "react";
import { clientMoveTask } from "../../../store/slices/taskReducer";

export const useDnd = (dispatch: AppDispatch, tasks: Task[], containers: TaskContainer[]) => {
  const [activeTask, setActiveTask] = useState<Task | undefined>();

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const ids = tasks.map((task) => task.taskId);
      const oldIndex = ids.indexOf(active.id);
      const newIndex = ids.indexOf(over.id);

      return arrayMove(tasks, oldIndex, newIndex);
    }

    setActiveTask(undefined);
  }

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const { id } = active;

    setActiveTask(tasks.find((task) => task.taskId === id));
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;

    const activeContainer = containers.find((container) => container.containerId === active?.id);
    const overContainer = containers.find((container) => container.containerId === over?.id);
    // console.log({ activeContainer: active?.id, overContainer: over?.id });

    const overTask = tasks.find((task) => task.taskId === over?.id);

    // if (overTask) {
    //   dispatch(clientMoveTask({ ...activeTask, containerId: overTask.containerId }));
    // }

    // if (activeContainer?.containerId === overContainer?.containerId) {
    //   return;
    // }

    // if (activeContainer !== overContainer) {
    //   console.log("dispatch called containers");
    //   dispatch(clientMoveTask({ ...activeTask, containerId: over.id }));
    // }
  }

  return {
    activeTask,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
};
