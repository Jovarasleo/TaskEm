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
}

function TasksContainer({
  dataTestId,
  tasks,
  todo,
  container,
  selectedContainer,
  dragging,
  addNewTask,
  saveTask,
  handleDragOver,
  handleDragStart,
}: TaskContainer) {
  const containerRef = useRef<HTMLDivElement>(null);
  const handleDragPosition = (
    e: React.DragEvent<HTMLElement>,
    ref: RefObject<HTMLDivElement>,
    container: string
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const target = ref.current || (e.target as any);
    const draggableElements: HTMLElement[] =
      target.querySelectorAll("[draggable]");
    const rect = target.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;

    const getIndex = [...draggableElements].reduce((acc, item, index) => {
      if (
        item.offsetTop + item.offsetHeight - mouseY < item.offsetHeight / 2 &&
        selectedContainer !== container
      ) {
        return (acc = tasks.length);
      }
      if (item.offsetTop - mouseY < item.offsetHeight / 2) {
        return (acc = index);
      }
      return acc;
    }, 0);
    handleDragOver(e, container, getIndex);
  };

  return (
    <section
      key={container}
      data-testid={dataTestId}
      className={styles.container}
      role={container}
      onDragOver={
        dragging
          ? (e) => handleDragPosition(e, containerRef, container)
          : () => {}
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
