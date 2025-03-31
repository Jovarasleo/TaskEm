import clsx from "clsx";
import React, { useRef, useState } from "react";
import { BsPlusCircle } from "react-icons/bs";
import useOutsideClick from "../../../../hooks/useOutsideClick";
import { AppDispatch } from "../../../../store/configureStore";
import { clientCreateTask } from "../../../../store/slices/taskReducer";
import { uid } from "../../../../util/uid";
import { HandleDrag, Task as TaskModel } from "../../model/task";
import TaskCard from "../task/TaskCard";
import styles from "./styles.module.scss";

interface TaskContainer {
  dataTestId?: string;
  projectId: string;
  tasks: TaskModel[];
  tasksCount: number;
  containerId: string;
  containerName: string;
  dragging: boolean;
  currentlyDragging: string;
  dispatch: AppDispatch;
  handleDrag: HandleDrag;
  handlePointerDown: (
    e: React.PointerEvent<HTMLLIElement>,
    taskItem: HTMLLIElement | null,
    container: string,
    index: number,
    taskId: string
  ) => void;
}

function TasksContainer({
  projectId,
  tasks,
  tasksCount,
  containerId,
  containerName,
  dragging,
  currentlyDragging,
  dispatch,
  handleDrag,
  handlePointerDown,
}: TaskContainer) {
  const containerRef = useRef<HTMLDivElement>(null);
  const outsideClickRef = useRef<HTMLTextAreaElement>(null);

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

  useOutsideClick(createNewTask, [outsideClickRef]);

  return (
    <section
      key={containerId}
      className={clsx(styles.tasksContainerWrapper, dragging && styles.containerHover)}
      role={containerName}
      onPointerOver={(e) => handleDrag(e, containerRef, containerId)}
      ref={containerRef}
    >
      <div>
        <div className={styles.newTaskContainer}>
          <h3>{containerName}</h3>
          {todoContainer && (
            <button
              role={"create_task"}
              onClick={() => setAddTask(true)}
              className={styles.addTaskButton}
            >
              <BsPlusCircle />
            </button>
          )}
        </div>
        {addTask ? (
          <div className={styles.textareaWrapper}>
            <textarea
              autoFocus
              placeholder="Enter your thoughts here.."
              className={styles.input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => handleKeypress(e)}
              value={input}
              ref={outsideClickRef}
            />
          </div>
        ) : null}
      </div>
      <ul className={clsx(styles.tasksContainer)}>
        {tasks.map((task, index) => {
          return (
            <TaskCard
              key={task.taskId}
              task={task}
              index={index}
              dragging={dragging}
              container={containerId}
              currentlyDragging={currentlyDragging}
              dispatch={dispatch}
              handlePointerDown={handlePointerDown}
            />
          );
        })}
      </ul>
    </section>
  );
}
export default TasksContainer;
