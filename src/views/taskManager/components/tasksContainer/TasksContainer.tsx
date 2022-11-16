import { useState, useRef } from "react";
import {
  handleDragStart,
  handleDragOver,
  handleDrag,
  DragItem,
  Task as TaskModel,
  Actions,
} from "../../model/task";
import useOutsideClick from "../../../../hooks/useOutsideClick";
import { uid } from "../../hooks/useGenerateId";
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
  dispatch: (action: Actions) => void;
  handleDragStart: handleDragStart;
  handleDragOver: handleDragOver;
  handleDrag: handleDrag;
}

function TasksContainer({
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

  useOutsideClick(createTask, outsideClickRef);

  return (
    <section
      key={container}
      className={styles.container}
      role={container}
      onDragOver={
        dragging ? (e) => handleDrag(e, containerRef, container) : undefined
      }
      ref={containerRef}
    >
      {container === "todo" && (
        <button
          role={"create_task"}
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
          value={input}
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
