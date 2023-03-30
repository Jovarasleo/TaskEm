import { useState, useRef } from "react";
import {
  HandleDragStart,
  HandleDragLeave,
  HandleDrag,
  DragItem,
  Task as TaskModel,
  Actions,
} from "../../model/task";
import usePositionIndicator from "../../hooks/usePositionIndicator";
import useOutsideClick from "../../../../hooks/useOutsideClick";
import { uid } from "../../../../util/uid";
import TaskCard from "../taskCard/TaskCard";
import styles from "./styles.module.scss";
import clsx from "clsx";
import { BsPlusCircle } from "react-icons/bs";

interface TaskContainer {
  dataTestId?: string;
  projectId: string;
  tasks: TaskModel[];
  container: string;
  dragging: boolean;
  toContainer: string;
  nextIndex: null | number;
  dragItem: DragItem | null;
  dispatch: (action: Actions) => void;
  handleDrag: HandleDrag;
  handleDragStart: HandleDragStart;
  handleDragLeave: HandleDragLeave;
  handleDragEnd: () => void;
}

function TasksContainer({
  projectId,
  tasks,
  container,
  toContainer,
  nextIndex,
  dragging,
  dragItem,
  dispatch,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleDrag,
  handleDragLeave,
  handleDragStart,
  handleDragEnd,
  handleAllowTransfer,
}: TaskContainer) {
  const containerRef = useRef<HTMLDivElement>(null);
  const outsideClickRef = useRef<HTMLTextAreaElement>(null);

  const [addTask, setAddTask] = useState(false);
  const [input, setInput] = useState("");

  const todoContainer = container === "todo";

  const createTask = () => {
    if (input.length) {
      const id = uid();
      dispatch({
        type: "ADD_TASK",
        payload: {
          projectId,
          containerName: "todo",
          value: input,
          taskId: id,
        },
      });
    }
    setAddTask(false);
    setInput("");
  };

  const handleKeypress = (e: React.KeyboardEvent<HTMLElement>) => {
    if ((e.key === "Enter" && !e.shiftKey) || e.key === "Escape") {
      createTask();
    }
  };

  const position = usePositionIndicator(toContainer, container, nextIndex, 0, 0);
  useOutsideClick(createTask, outsideClickRef);
  const showPointer = position === "before";

  return (
    <section
      className={styles.container}
      role={container}
      onMouseOver={(e) => handleDrag(e, containerRef, container)}
      onMouseEnter={() => handleAllowTransfer()}
      ref={containerRef}
    >
      <div>
        <div className={styles.newTaskContainer}>
          <h3>{container}</h3>
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

      {showPointer && !tasks.length ? (
        <div className={styles.pointer}></div>
      ) : null}
      <ul
        className={clsx(
          styles.tasksContainer,
          dragging ? styles.pointerNone : ""
        )}
      >
        {tasks?.map((task, index) => {
          return (
            <TaskCard
              key={task?.taskId}
              task={task}
              index={index}
              projectId={projectId}
              arrayLength={tasks.length}
              dragging={dragging}
              container={container}
              containerRef={containerRef}
              nextIndex={nextIndex}
              toContainer={toContainer}
              dragItem={dragItem}
              dispatch={dispatch}
              handleDragStart={handleDragStart}
              handleDrag={handleDrag}
              handleMouseDown={handleMouseDown}
              handleMouseMove={handleMouseMove}
              handleMouseUp={handleMouseUp}
              handleAllowTransfer={handleAllowTransfer}
            />
          );
        })}
      </ul>
    </section>
  );
}
export default TasksContainer;
