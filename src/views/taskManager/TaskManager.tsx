import { useState } from "react";
import { TaskContainers, Task, MoveTask, SaveTask } from "./model/task";
import { useDragAndDrop } from "./hooks/useDragAndDrop";
import useLocalStorage from "./hooks/useLocalStorage";
import TasksContainer from "./components/tasksContainer/TasksContainer";
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

  const newTask = () => {
    setTasks((prevState: TaskContainers) => {
      return {
        ...prevState,
        todo: [...prevState.todo, { name: "", description: "", id: uid() }],
      };
    });
  };

  const saveTask: SaveTask = (container, id, name, description) => {
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

  const moveTask: MoveTask = (
    fromContainer,
    toContainer,
    fromIndex,
    toIndex
  ) => {
    if (!fromContainer) return;
    const getTask = tasks[fromContainer].splice(fromIndex, 1)[0];
    tasks[toContainer].splice(toIndex, 0, getTask);

    setTasksToLocal((prevState: TaskContainers) => {
      return {
        ...prevState,
        ...tasks,
      };
    });
  };

  const {
    handleDragStart,
    handleDragOver,
    handleDrag,
    dragging,
    nextPosition,
    toContainer,
    dragItem,
  } = useDragAndDrop(moveTask);

  return (
    <div className={styles.managerContainer}>
      {Object.keys(tasks)?.map((container) => {
        return (
          <TasksContainer
            key={container}
            tasks={tasks[container as keyof TaskContainers]}
            container={container}
            newTask={newTask}
            saveTask={saveTask}
            handleDragStart={handleDragStart}
            handleDragOver={handleDragOver}
            handleDrag={handleDrag}
            dragging={dragging}
            nextPosition={nextPosition}
            toContainer={toContainer}
            dragItem={dragItem.current}
          />
        );
      })}
    </div>
  );
}
export default TaskManger;
