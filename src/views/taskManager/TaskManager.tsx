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
  const [dragging, setDragging] = useState(false);
  const dragItem = useRef();
  const dragItemNode = useRef();

  const getStyles = ({
    container,
    index,
  }: {
    container: string;
    index: number;
  }) => {
    if (
      dragItem.current.container === container &&
      dragItem.current.index === index
    ) {
      return "current";
    }
    return "dnd-item";
  };

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

  const handleDragStart = (e: any, task: any) => {
    dragItemNode.current = e.target;
    dragItem.current = task;
    setDragging((prevValue) => (prevValue = true));
    dragItemNode?.current?.addEventListener("dragend", handleDragEnd);
  };

  const handleDragEnter = (e: any, targetItem: any) => {
    if (dragItemNode.current !== e.target) {
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
    console.log("drag end fired");
    setDragging((prevValue) => (prevValue = false));
    console.log(dragging);
    dragItem.current = null;
    dragItemNode?.current?.removeEventListener("dragend", handleDragEnd);
    dragItemNode.current = null;
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

    setTasksToLocal((prevState: TaskContainers) => {
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
            getStyles={getStyles}
          />
        );
      })}
    </div>
  );
}
export default TaskManger;
