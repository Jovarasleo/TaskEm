import Task from "../task/Task";
import styles from "./styles.module.scss";

interface TaskManagerProps {
  dataTestId?: string;
  tasks: { name: string; description?: string }[];
}
function TasksContainer({ dataTestId, tasks }: TaskManagerProps) {
  return (
    <section data-testid={dataTestId} className={styles.container}>
      {tasks?.map(({ name, description }, index) => {
        return <Task key={index} name={name} description={description} />;
      })}
    </section>
  );
}
export default TasksContainer;
