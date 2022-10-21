import { useState, useRef } from "react";
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
  const dragItem = useRef();
  const dragItemNode = useRef();
  const [dragging, setDragging] = useState(false);

  const handleDragStart = (e: any, task: any) => {
    console.log("TASKITEM", tasks);
    dragItemNode.current = e.target;
    dragItem.current = task;
    setDragging(true);
  };

  const handleDragEnter = (e: any, targetItem: any) => {
    e.stopPropagation();
    if (dragItemNode.current !== e.target) {
      console.log("passed if drag enter");
      console.log(
        dragItem.current.container,
        targetItem.container,
        dragItem.current?.index,
        targetItem.index
      );
      moveTask(
        dragItem.current?.container,
        targetItem.container,
        dragItem.current?.index,
        targetItem.index
      );
      dragItem.current.index = targetItem.index;
      dragItem.current.container = targetItem.container;
    }
  };

  const handleDragEnd = () => {
    setDragging(false);
    dragItem.current = null;
    dragItemNode.current = null;
    setTasksToLocal((prevState: TaskContainers) => {
      return {
        ...prevState,
        ...tasks,
      };
    });
  };

  const moveTask = (
    fromContainer: string,
    toContainer: string,
    fromIndex: number,
    toIndex: number
  ) => {
    let tasksClone = { ...tasks };
    if (!tasksClone[fromContainer] || !tasksClone[fromContainer].length) return;
    const getTask = tasksClone[fromContainer].splice(fromIndex, 1)[0];
    tasksClone[toContainer].splice(toIndex, 0, getTask);

    // tasksClone.splice(fromIndex + 1, 0, tasksClone.splice(toIndex, 1)[0]);

    setTasks((prevState: TaskContainers) => {
      return {
        ...prevState,
        ...tasksClone,
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
            todo={container === "todo"}
            addNewTask={addNewTask}
            saveTask={saveTask}
            handleDragStart={handleDragStart}
            handleDragEnter={handleDragEnter}
            dragging={dragging}
            handleDragEnd={handleDragEnd}
          />
        );
      })}
    </div>
  );
}
export default TaskManger;
