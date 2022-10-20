import Task from "../task/Task";
import styles from "./styles.module.scss";

interface TaskManagerProps {
  dataTestId?: string;
  tasks: { name: string; description?: string; id: string }[];
  todo?: boolean;
  container: string;
  addNewTask?: (container: string) => void;
  saveTask: (
    container: string,
    id: string,
    name: string,
    description: string
  ) => void;
}

function TasksContainer({
  dataTestId,
  tasks,
  todo,
  container,
  addNewTask,
  saveTask,
}: TaskManagerProps) {
  return (
    <section
      key={container}
      data-testid={dataTestId}
      className={styles.container}
      role={container}
    >
      {todo && (
        <button
          role={"newTask"}
          onClick={addNewTask ? () => addNewTask(container) : () => {}}
        >
          +
        </button>
      )}
      {tasks?.map(({ name, description, id }) => {
        return (
          <Task
            key={id}
            name={name}
            description={description}
            id={id}
            container={container}
            saveTask={saveTask}
          />
        );
      })}
    </section>
  );
}
export default TasksContainer;
