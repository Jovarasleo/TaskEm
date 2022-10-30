import { useRef, RefObject } from "react";
import { Task as TaskModel } from "views/taskManager/model/task";
import TaskCard from "../taskCard/TaskCard";
import styles from "./styles.module.scss";

interface TaskContainer {
  dataTestId?: string;
  tasks: TaskModel[];
  todo?: boolean;
  container: string;
  addNewTask?: (container: string) => void;
  saveTask: (
    container: string,
    id: string,
    name: string,
    description: string
  ) => void;
  dragging: boolean;
  selectedContainer: string | undefined;
  handleDragStart: (
    e: React.DragEvent<HTMLElement>,
    container: string,
    index: number
  ) => void;
  handleDragOver: (
    e: React.DragEvent<HTMLElement>,
    container: string,
    index: number
  ) => void;
  handleDrag: (
    e: React.DragEvent<HTMLElement>,
    ref: RefObject<HTMLDivElement>,
    container: string
  ) => void;
}

function TasksContainer({
  dataTestId,
  tasks,
  todo,
  container,
  // selectedContainer,
  dragging,
  addNewTask,
  saveTask,
  handleDrag,
  handleDragStart,
}: TaskContainer) {
  const containerRef = useRef<HTMLDivElement>(null);

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
      {todo && (
        <button
          role={"newTask"}
          onClick={addNewTask ? () => addNewTask(container) : () => {}}
          className={styles.addTaskButton}
        >
          +
        </button>
      )}
      <h3>{container}</h3>
      {tasks?.map((task, index) => {
        return (
          <TaskCard
            key={task?.id}
            index={index}
            task={task}
            dragging={dragging}
            container={container}
            saveTask={saveTask}
            handleDragStart={handleDragStart}
          />
        );
      })}
    </section>
  );
}
export default TasksContainer;
