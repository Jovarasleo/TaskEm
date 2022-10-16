import TasksContainer from "./components/tasksContainer/TasksContainer";
import styles from "./styles.module.scss";

interface Task {
  name: string;
  description: string;
}
interface TaskContainers {
  todo: Task[];
  progress: Task[];
  done: Task[];
}
function TaskManger() {
  const tasks: TaskContainers = {
    todo: [
      { name: "todo", description: "todo" },
      { name: "todo1", description: "todo1" },
      { name: "todo2", description: "todo2" },
    ],
    progress: [{ name: "progress", description: "progress" }],
    done: [{ name: "done", description: "done" }],
  };
  return (
    <div className={styles.managerContainer}>
      {Object.keys(tasks).map((container) => {
        return (
          <TasksContainer tasks={tasks[container as keyof TaskContainers]} />
        );
      })}
    </div>
  );
}
export default TaskManger;
