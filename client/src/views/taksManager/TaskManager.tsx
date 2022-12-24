import { TaskContainers } from "./model/task";
import { useDragAndDrop } from "./hooks/useDragAndDrop";
import useLocalStorage from "./hooks/useLocalStorage";
import TasksContainer from "./components/taskContainer/TasksContainer";
import TaskContext, { TasksContext } from "../../context/taskContext";
import { useContext } from "react";
import styles from "./styles.module.scss";

function TaskManager() {
  const { state, dispatch, selectedProject } = useContext(
    TaskContext
  ) as TasksContext;

  useLocalStorage(selectedProject, state);

  const {
    handleDrag,
    handleDragStart,
    handleDragLeave,
    dragging,
    nextIndex,
    toContainer,
    dragItem,
  } = useDragAndDrop(dispatch);

  return (
    <>
      <h2 className={styles.projectName}>{selectedProject}</h2>
      <div className={styles.managerContainer}>
        {Object.keys(state)?.map((container) => {
          return (
            <TasksContainer
              key={container}
              tasks={state[container as keyof TaskContainers]}
              container={container}
              dispatch={dispatch}
              handleDrag={handleDrag}
              handleDragStart={handleDragStart}
              handleDragLeave={handleDragLeave}
              dragging={dragging}
              nextIndex={nextIndex}
              toContainer={toContainer}
              dragItem={dragItem.current}
            />
          );
        })}
      </div>
    </>
  );
}
export default TaskManager;
