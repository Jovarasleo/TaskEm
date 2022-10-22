import { Task as TaskModel } from "views/taskManager/model/task";
import Task from "../task/Task";
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
  handleDragStart: (e: any, task: any) => void;
  handleDragEnter: (e: any, task: any) => void;
  getStyles: (item: {}) => string;
}

function TasksContainer({
  dataTestId,
  tasks,
  todo,
  container,
  dragging,
  addNewTask,
  saveTask,
  handleDragEnter,
  handleDragStart,
  getStyles,
}: TaskContainer) {
  return (
    <section
      key={container}
      data-testid={dataTestId}
      className={styles.container}
      role={container}
      onDragEnter={
        dragging && !tasks.length
          ? (e: any) => handleDragEnter(e, { container, index: 0 })
          : () => {}
      }
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
          <Task
            key={task.id}
            index={index}
            task={task}
            container={container}
            dragging={dragging}
            saveTask={saveTask}
            handleDragStart={handleDragStart}
            handleDragEnter={handleDragEnter}
            getStyles={getStyles}
          />
        );
      })}
    </section>
  );
}
export default TasksContainer;
