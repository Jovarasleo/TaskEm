import { useReducer } from "react";
import { taskReducer } from "./reducers/taskReducer";
import { TaskContainers } from "./model/task";
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
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const [localTasks] = useLocalStorage(state);
  // const [tasks, setTasks] = useState<TaskContainers>(initialState);

  const {
    handleDragStart,
    handleDragOver,
    handleDrag,
    dragging,
    nextPosition,
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
