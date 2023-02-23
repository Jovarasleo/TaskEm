import { useDragAndDrop } from "./hooks/useDragAndDrop";
import useLocalStorage from "./hooks/useLocalStorage";
import TasksContainer from "./components/taskContainer/TasksContainer";
import TaskContext, { TasksContext } from "../../context/taskContext";
import { useContext, useState } from "react";
import { TaskContainers } from "./model/task";
import styles from "./styles.module.scss";
import { BsGear } from "react-icons/bs";
import Button from "@components/button/Button";
import Dropdown from "@components/dropdown/Dropdown";

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

  const [showOptions, setShowOptions] = useState(false);

  return (
    <>
      <span className={styles.projectNameWrapper}>
        <h2 className={styles.projectName}>{selectedProject}</h2>
        <div>
          <Button
            type="button"
            onClick={() => setShowOptions((prevState) => !prevState)}
            className={styles.projectSettingsGear}
          >
            <BsGear />
          </Button>
          <Dropdown
            options={[
              {
                title: "rename",
                onClick: () =>
                  dispatch({ type: "DELETE_PROJECT", project: selectedProject }),
              },
              {
                title: "delete",
                onClick: () =>
                  dispatch({ type: "DELETE_PROJECT", project: selectedProject }),
              },
            ]}
            visibility={showOptions}
          />
        </div>
      </span>
      <div className={styles.managerContainer}>
        {state && Object.keys(state).length !== 0 ? (
          Object.keys(state.tasks)?.map((container) => {
            return (
              <TasksContainer
                key={container}
                tasks={state.tasks[container as keyof TaskContainers]}
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
          })
        ) : (
          <h3 style={{ color: "white", fontSize: "4rem" }}>No projects yet!</h3>
        )}
      </div>
    </>
  );
}
export default TaskManager;
