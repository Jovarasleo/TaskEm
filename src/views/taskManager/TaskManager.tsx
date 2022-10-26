import { useState, useRef } from "react";
import { TaskContainers, Task } from "./model/task";
import TasksContainer from "./components/tasksContainer/TasksContainer";
import useLocalStorage from "./hooks/useLocalStorage";
import { useDragAndDrop } from "./hooks/useDragAndDrop";
import styles from "./styles.module.scss";

function TaskManger() {
  const initialState: TaskContainers = {
    todo: [],
    progress: [],
    done: [],
  };

  const [tasksToLocal, setTasksToLocal] = useLocalStorage(initialState);
  const [tasks, setTasks] = useState(tasksToLocal);
  // const [dragging, setDragging] = useState(false);
  // const dragItem = useRef<DragItem | null>(null);
  // const dragItemNode = useRef<HTMLDivElement | null>(null);
  // const dragtoIndex = useRef(0);
  // const dragtoContainer = useRef("done");

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

  const moveTask = (
    fromContainer: string | undefined,
    toContainer: string,
    fromIndex: number | undefined,
    toIndex: number
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
  const { handleDragStart, handleDragOver, dragging, dragItem } =
    useDragAndDrop(moveTask);

  return (
    <div className={styles.managerContainer}>
      {Object.keys(tasks)?.map((container) => {
        return (
          <TasksContainer
            key={container}
            tasks={tasks[container as keyof TaskContainers]}
            container={container}
            selectedContainer={dragItem?.current?.container}
            todo={container === "todo"}
            addNewTask={addNewTask}
            saveTask={saveTask}
            handleDragStart={handleDragStart}
            handleDragOver={handleDragOver}
            dragging={dragging}
          />
        );
      })}
    </div>
  );
}
export default TaskManger;
