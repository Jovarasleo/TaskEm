import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import React, { useMemo, useRef, useState } from "react";
import { HiOutlinePlusSm } from "react-icons/hi";
import { AppDispatch } from "../../../../store/configureStore";
import { clientCreateTask } from "../../../../store/slices/taskReducer";
import { uid } from "../../../../util/uid";
import { Task as TaskModel } from "../../model/task";
import TaskCard from "../task/TaskCard";
import "./tasksContainer.css";

interface TaskContainer {
  dataTestId?: string;
  projectId: string;
  tasks: TaskModel[];
  tasksCount: number;
  containerId: string;
  containerName: string;
  dispatch: AppDispatch;
}

function TasksContainer({
  projectId,
  tasks,
  tasksCount,
  containerId,
  containerName,
  dispatch,
}: TaskContainer) {
  const outsideClickRef = useRef<HTMLTextAreaElement>(null);
  const itemIds = useMemo(() => tasks.map((task) => task.taskId), [tasks]);
  const memoTasks = useMemo(() => tasks, [tasks]);

  const { setNodeRef } = useDroppable({
    id: containerId,
  });

  const [addTask, setAddTask] = useState(false);
  const [input, setInput] = useState("");

  const todoContainer = containerName === "Todo";

  const createNewTask = () => {
    const positionValuesList = tasks.map((item) => item.position);
    const smallestValue = positionValuesList.length
      ? Math.min(...positionValuesList) - 1000
      : new Date().getTime();

    if (input.length) {
      dispatch(
        clientCreateTask({
          projectId,
          containerId,
          value: input,
          taskId: uid(),
          count: tasksCount + 1,
          position: smallestValue,
        })
      );
    }
    setAddTask(false);
    setInput("");
  };

  const handleKeypress = (e: React.KeyboardEvent<HTMLElement>) => {
    if ((e.key === "Enter" && !e.shiftKey) || e.key === "Escape") {
      createNewTask();
    }
  };

  return (
    <section className="tasksContainerWrapper p-4 rounded-3xl">
      <div className="flex relative justify-between items-center mb-1">
        <h3>{containerName}</h3>
        {todoContainer && (
          <button
            onClick={() => setAddTask(true)}
            className="addTaskButton"
            aria-label="create new task"
          >
            <HiOutlinePlusSm />
          </button>
        )}
      </div>
      {addTask ? (
        <div className="textareaWrapper">
          <textarea
            autoFocus
            placeholder="Enter your thoughts here.."
            className="input"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => handleKeypress(e)}
            value={input}
            ref={outsideClickRef}
          />
        </div>
      ) : null}
      <SortableContext id={containerId} items={itemIds} strategy={verticalListSortingStrategy}>
        <ul
          className="flex flex-col gap-2 h-full tasksContainer"
          role={containerName}
          id={containerId}
          ref={setNodeRef}
        >
          {memoTasks.map((task) => {
            return (
              <TaskCard key={task.taskId} task={task} taskId={task.taskId} dispatch={dispatch} />
            );
          })}
        </ul>
      </SortableContext>
    </section>
  );
}
export default TasksContainer;
