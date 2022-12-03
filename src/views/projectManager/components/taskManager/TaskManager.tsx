import { TaskContainers } from "../../model/task";

import { useDragAndDrop } from "../../hooks/useDragAndDrop";
import useLocalStorage from "../../hooks/useLocalStorage";
import TasksContainer from "../taskContainer/TasksContainer";
import styles from "../../styles.module.scss";

function TaskManager({ project, state, dispatch }: any) {
  useLocalStorage(project, state);
  const {
    handleDragStart,
    handleDragOver,
    handleDrag,
    dragging,
    nextIndex,
    toContainer,
    dragItem,
  } = useDragAndDrop(dispatch);
  console.log({ state });
  return (
    <>
      <h2>{project}</h2>
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
    </>
  );
}
export default TaskManager;
