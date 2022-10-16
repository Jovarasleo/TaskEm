import Task from "../task/Task";
import styles from "./styles.module.scss";

interface TaskManagerProps {
  dataTestId?: string;
  tasks: { name: string; description?: string }[];
  todo?: boolean;
  addNewTask?: () => void | false;
}
function TasksContainer({
  dataTestId,
  tasks,
  todo,
  addNewTask,
}: TaskManagerProps) {
  return (
    <section data-testid={dataTestId} className={styles.container}>
      {todo && (
        <button
          role={"newTask"}
          onClick={addNewTask ? () => addNewTask() : () => {}}
        >
          +
        </button>
      )}
      {tasks?.map(({ name, description }, index) => {
        return <Task key={index} name={name} description={description} />;
      })}
    </section>
  );
}
export default TasksContainer;
