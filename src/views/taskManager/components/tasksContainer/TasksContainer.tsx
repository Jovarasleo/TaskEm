import { useRef } from "react";
import {
  SaveTask,
  handleDragStart,
  handleDragOver,
  handleDrag,
  DragItem,
  Task as TaskModel,
} from "../../model/task";
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
  newTask?: (container: string) => void;
  saveTask: SaveTask;
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
  newTask,
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
      {container === "todo" && (
        <button
          role={"newTask"}
          onClick={newTask ? () => newTask(container) : () => {}}
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
            task={task}
            index={index}
            arrayLength={tasks.length}
            dragging={dragging}
            container={container}
            nextPosition={nextPosition}
            toContainer={toContainer}
            dragItem={dragItem}
            saveTask={saveTask}
            handleDragStart={handleDragStart}
          />
        );
      })}
    </section>
  );
}
export default TasksContainer;
