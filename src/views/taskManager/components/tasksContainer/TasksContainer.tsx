import { useState, useRef } from "react";
import {
  handleDragStart,
  handleDragOver,
  handleDrag,
  DragItem,
  Task as TaskModel,
} from "../../model/task";
import useOutsideClick from "../../../../hooks/useOutsideClick";
import TaskCard from "../taskCard/TaskCard";
import styles from "./styles.module.scss";

interface TaskContainer {
  dataTestId?: string;
  tasks: TaskModel[];
  container: string;
  dragging: boolean;
  toContainer: string;
  nextPosition: null | number;
  dragItem: DragItem | null;
  dispatch: (action: {}) => void;
  handleDragStart: handleDragStart;
  handleDragOver: handleDragOver;
  handleDrag: handleDrag;
}

function TasksContainer({
  dataTestId,
  tasks,
  container,
  toContainer,
  nextPosition,
  dragging,
  dragItem,
  dispatch,
  handleDrag,
  handleDragStart,
}: TaskContainer) {
  const containerRef = useRef<HTMLDivElement>(null);
  const outsideClickRef = useRef<HTMLTextAreaElement>(null);
  const [addTask, setAddTask] = useState(false);
  const [input, setInput] = useState("");

  const createTask = () => {
    setAddTask(false);
    setInput("");
    if (input.length) {
      dispatch({ type: "ADD_TASK", value: input });
    }
  };
  const handleKeypress = (e: React.KeyboardEvent<HTMLElement>) => {
    if ((e.key === "Enter" && !e.shiftKey) || e.key === "Escape") {
      createTask();
    }
  };

  useOutsideClick(createTask, outsideClickRef);

  return (
    <section
      key={container}
      data-testid={dataTestId}
      className={styles.container}
      role={container}
      onDragOver={
        dragging ? (e) => handleDrag(e, containerRef, container) : () => {}
      }
      ref={containerRef}
    >
      {container === "todo" && (
        <button
          role={"newTask"}
          onClick={() => setAddTask(true)}
          className={styles.addTaskButton}
        >
          +
        </button>
      )}
      <h3>{container}</h3>
      {addTask ? (
        <textarea
          autoFocus
          className={styles.input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => handleKeypress(e)}
          ref={outsideClickRef}
        />
      ) : null}

      {tasks?.map((task, index) => {
        return (
          <TaskCard
            key={task?.id}
            task={task}
            index={index}
            arrayLength={tasks.length}
            dragging={dragging}
            container={container}
            nextPosition={nextPosition}
            toContainer={toContainer}
            dragItem={dragItem}
            dispatch={dispatch}
            handleDragStart={handleDragStart}
          />
        );
      })}
    </section>
  );
}
export default TasksContainer;
