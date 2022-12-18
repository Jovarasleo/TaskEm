import { useState, useRef } from "react";
import {
  handleDragStart,
  handleDragLeave,
  handleDrag,
  DragItem,
  Task as TaskModel,
  Actions,
} from "../../model/task";
import usePositionIndicator from "../../hooks/usePositionIndicator";
import useOutsideClick from "../../../../hooks/useOutsideClick";
import { uid } from "../../hooks/useGenerateId";
import TaskCard from "../taskCard/TaskCard";
import styles from "./styles.module.scss";
import clsx from "clsx";

interface TaskContainer {
  dataTestId?: string;
  tasks: TaskModel[];
  container: string;
  dragging: boolean;
  toContainer: string;
  nextIndex: null | number;
  dragItem: DragItem | null;
  dispatch: (action: Actions) => void;
  handleDrag: handleDrag;
  handleDragStart: handleDragStart;
  handleDragLeave: handleDragLeave;
}

function TasksContainer({
  tasks,
  container,
  toContainer,
  nextIndex,
  dragging,
  dragItem,
  dispatch,
  handleDrag,
  handleDragLeave,
  handleDragStart,
}: TaskContainer) {
  const containerRef = useRef<HTMLDivElement>(null);
  const outsideClickRef = useRef<HTMLTextAreaElement>(null);

  const [addTask, setAddTask] = useState(false);
  const [input, setInput] = useState("");

  const todoContainer = container === "todo";

  const createTask = () => {
    if (input.length) {
      const id = uid();
      dispatch({ type: "ADD_TASK", value: input, id: id });
    }
    setAddTask(false);
    setInput("");
  };

  const handleKeypress = (e: React.KeyboardEvent<HTMLElement>) => {
    if ((e.key === "Enter" && !e.shiftKey) || e.key === "Escape") {
      createTask();
    }
  };

  const position = usePositionIndicator(
    toContainer,
    container,
    nextIndex,
    0,
    0
  );
  useOutsideClick(createTask, outsideClickRef);
  const showPointer = position === "before";

  return (
    <section
      key={container}
      className={styles.container}
      role={container}
      onDragOver={
        dragging ? (e) => handleDrag(e, containerRef, container) : undefined
      }
      onDragLeave={dragging ? (e) => handleDragLeave(e) : undefined}
      ref={containerRef}
    >
      {todoContainer && (
        <button
          role={"create_task"}
          onClick={() => setAddTask(true)}
          className={styles.addTaskButton}
        />
      )}
      <h3>{container}</h3>
      {addTask ? (
        <textarea
          autoFocus
          className={styles.input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => handleKeypress(e)}
          value={input}
          ref={outsideClickRef}
        />
      ) : null}
      {showPointer && !tasks.length ? (
        <div className={styles.pointer}></div>
      ) : null}
      <div
        className={clsx(
          styles.tasksContainer,
          dragging ? styles.pointerNone : ""
        )}
      >
        {tasks?.map((task, index) => {
          return (
            <TaskCard
              key={task?.id}
              task={task}
              index={index}
              arrayLength={tasks.length}
              dragging={dragging}
              container={container}
              nextIndex={nextIndex}
              toContainer={toContainer}
              dragItem={dragItem}
              dispatch={dispatch}
              handleDragStart={handleDragStart}
            />
          );
        })}
      </div>
    </section>
  );
}
export default TasksContainer;
