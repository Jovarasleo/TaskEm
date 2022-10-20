import { useState } from "react";
import { TaskContainers, Task } from "./model/task";
import TasksContainer from "./components/tasksContainer/TasksContainer";
import useLocalStorage from "./hooks/useLocalStorage";
import styles from "./styles.module.scss";

function TaskManger() {
  const initialState: TaskContainers = {
    todo: [],
    progress: [],
    done: [],
  };

  const [tasksToLocal, setTasksToLocal] = useLocalStorage(initialState);
  const [tasks, setTasks] = useState(tasksToLocal);
  const uid = () => {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  };

  const addNewTask = () => {
    setTasks((prevState: TaskContainers) => {
      return {
        ...prevState,
        todo: [...prevState.todo, { name: "", description: "", id: uid() }],
      };
    });
  };

  const saveTask = (
    container: string,
    id: string,
    name: string,
    description: string
  ) => {
    const taskClone = [...tasks[container]];
    const newTasks = taskClone
      .map((task: Task) => {
        if (task.id === id) {
          task.name = name;
          task.description = description;
        }
        return task;
      })
      .filter((task) => task.name.length || task.description.length);

    setTasksToLocal((prevState: TaskContainers) => {
      return {
        ...prevState,
        [container]: newTasks,
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
            container={container}
            todo={container === "todo" ? true : false}
            addNewTask={addNewTask}
            saveTask={saveTask}
          />
        );
      })}
    </div>
  );
}
export default TaskManger;
