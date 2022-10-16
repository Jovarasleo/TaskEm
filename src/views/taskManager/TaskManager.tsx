import { useState } from "react";
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
  const initialState: TaskContainers = {
    todo: [
      { name: "todo", description: "todo" },
      { name: "todo1", description: "todo1" },
      { name: "todo2", description: "todo2" },
    ],
    progress: [{ name: "progress", description: "progress" }],
    done: [{ name: "done", description: "done" }],
  };
  const [tasks, setTasks] = useState(initialState);

  const addNewTask = () => {
    setTasks((prevState) => {
      return {
        ...prevState,
        todo: [...prevState.todo, { name: "", description: "" }],
      };
    });
  };

  return (
    <div className={styles.managerContainer}>
      {Object.keys(tasks).map((container) => {
        return (
          <TasksContainer
            key={container}
            tasks={tasks[container as keyof TaskContainers]}
            todo={container === "todo" ? true : false}
            addNewTask={addNewTask}
          />
        );
      })}
    </div>
  );
}
export default TaskManger;
