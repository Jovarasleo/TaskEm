import React, { useState, useRef } from "react";
import {
  HandleDragStart,
  HandleDrag,
  DragItem,
  Task as TaskModel,
  Actions,
} from "../../model/task";
import useOutsideClick from "../../../../hooks/useOutsideClick";
import { uid } from "../../../../util/uid";
import TaskCard from "../taskCard/TaskCard";
import styles from "./styles.module.scss";
import clsx from "clsx";
import { BsPlusCircle } from "react-icons/bs";
import { createTask } from "../../../../store/slices/taskReducer";
import { AppDispatch } from "../../../../store/configureStore";

interface TaskContainer {
  dataTestId?: string;
  projectId: string;
  tasks: TaskModel[];
  tasksCount: number;
  containerId: string;
  containerName: string;
  dragging: boolean;
  toContainer: string;
  nextIndex: null | number;
  currentlyDragging: string;
  dispatch: AppDispatch;
  handleDrag: HandleDrag;
  handleDragStart: HandleDragStart;
  handleMouseDown: (
    e: React.MouseEvent<HTMLLIElement>,
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
  toContainer,
  nextIndex,
  dragging,
  currentlyDragging,
  dispatch,
  handleDrag,
  handleDragStart,
  handleMouseDown,
}: TaskContainer) {
  const containerRef = useRef<HTMLDivElement>(null);
  const outsideClickRef = useRef<HTMLTextAreaElement>(null);

  const [addTask, setAddTask] = useState(false);
  const [input, setInput] = useState("");

  const todoContainer = containerName === "Todo";

  const createNewTask = () => {
    if (input.length) {
      const id = uid();
      dispatch(
        createTask({ projectId, containerId, value: input, taskId: id, count: tasksCount + 1 })
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

  useOutsideClick(createNewTask, outsideClickRef);

  return (
    <section
      key={containerId}
      className={clsx(styles.tasksContainerWrapper, dragging && styles.containerHover)}
      role={containerName}
      onMouseOver={(e) => handleDrag(e, containerRef, containerId)}
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
              arrayLength={tasks.length}
              dragging={dragging}
              container={containerId}
              nextIndex={nextIndex}
              toContainer={toContainer}
              currentlyDragging={currentlyDragging}
              dispatch={dispatch}
              handleDragStart={handleDragStart}
              handleMouseDown={handleMouseDown}
            />
          );
        })}
      </ul>
    </section>
  );
}
export default TasksContainer;
