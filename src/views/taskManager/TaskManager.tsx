import { useState, useLayoutEffect } from "react";
import {
  TaskContainers,
  Task,
  MoveTask,
  SaveTask,
  DeleteTask,
} from "./model/task";
import { useDragAndDrop } from "./hooks/useDragAndDrop";
import useLocalStorage from "./hooks/useLocalStorage";
import TasksContainer from "./components/tasksContainer/TasksContainer";
import styles from "./styles.module.scss";

const initialState: TaskContainers = {
  todo: [],
  progress: [],
  done: [],
};

function TaskManger() {
  const [tasks, setTasks] = useState<TaskContainers>(initialState);
  const [localTasks] = useLocalStorage(tasks);

  useLayoutEffect(() => {
    setTasks(localTasks);
  }, []);

  console.log(tasks);
  const uid = () => {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  };

  const newTask = () => {
    setTasks((prevState) => {
      return {
        ...prevState,
        todo: [...prevState.todo, { name: "", description: "", id: uid() }],
      };
    });
  };

  const saveTask: SaveTask = (container, id, name, description) => {
    const taskClone = [...tasks[container]];
    taskClone
      .map((task: Task) => {
        if (task.id === id) {
          task.name = name;
          task.description = description;
        }
        return task;
      })
      .filter((task) => task.name.length || task.description.length);

    setTasks((prevState: TaskContainers) => {
      return {
        ...prevState,
        ...tasks,
      };
    });
  };

  const deleteTask: DeleteTask = (id, container) => {
    const taskClone = [...tasks[container]];
    const newArray = taskClone.filter((task) => task.id !== id);

    setTasks((prevState: TaskContainers) => {
      return {
        ...prevState,
        [container]: [...newArray],
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

    setTasks((prevState: TaskContainers) => {
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
            deleteTask={deleteTask}
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
