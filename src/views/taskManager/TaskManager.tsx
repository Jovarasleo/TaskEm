import { useReducer } from "react";
import { TaskContainers } from "./model/task";
import { taskReducer } from "./reducers/taskReducer";
import { useDragAndDrop } from "./hooks/useDragAndDrop";
import useLocalStorage from "./hooks/useLocalStorage";
import TasksContainer from "./components/tasksContainer/TasksContainer";
import styles from "./styles.module.scss";

const initialState: TaskContainers = {
  todo: [],
  progress: [],
  done: [],
};
const localStorage = window.localStorage.getItem("tasks");
const DEFAULT_STATE = localStorage ? JSON.parse(localStorage) : initialState;

function TaskManger() {
  const [state, dispatch] = useReducer(taskReducer, DEFAULT_STATE);
  useLocalStorage(state);

  const {
    handleDragStart,
    handleDragOver,
    handleDrag,
    dragging,
    nextIndex,
    toContainer,
    dragItem,
  } = useDragAndDrop(dispatch);

  return (
    <div className={styles.managerContainer}>
      {Object.keys(state)?.map((container) => {
        return (
          <TasksContainer
            key={container}
            tasks={state[container as keyof TaskContainers]}
            container={container}
            dispatch={dispatch}
            handleDragStart={handleDragStart}
            handleDragOver={handleDragOver}
            handleDrag={handleDrag}
            dragging={dragging}
            nextIndex={nextIndex}
            toContainer={toContainer}
            dragItem={dragItem.current}
          />
        );
      })}
    </div>
  );
}
export default TaskManger;
