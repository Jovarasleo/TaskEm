import { useDragAndDrop } from "./hooks/useDragAndDrop";
import useLocalStorage from "./hooks/useLocalStorage";
import TasksContainer from "./components/taskContainer/TasksContainer";
import TaskContext, { TasksContext } from "../../context/taskContext";
import { useContext, useState } from "react";
import styles from "./styles.module.scss";
import Dropdown from "@components/dropdown/Dropdown";
import Modal from "@components/modal/Modal";
import { createProject, getTask } from "../../db";
import type { RootState } from "../../store/configureStore";
import { useSelector, useDispatch } from "react-redux";
import { Task, TaskContainer } from "./model/task";

function TaskManager() {
  // const { state, dispatch, projectIndex } = useContext(
  //   TaskContext
  // ) as TasksContext;

  const project = useSelector((state: RootState) => state.project.data);
  const containers = useSelector((state: RootState) => state.container.data);
  const tasks = useSelector((state: RootState) => state.task.data);
  const dispatch = useDispatch();

  // console.log(containers);

  // useLocalStorage(state);

  // const projectId = state.length ? state[projectIndex]?.projectId : null;

  const {
    handleDrag,
    handleDragStart,
    handleMouseDown,
    handleDragCancel,
    dragging,
    nextIndex,
    toContainer,
  } = useDragAndDrop(dispatch, project[0]?.projectId);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [projectName, setProjectName] = useState("");

  const filteredTasks = (container: TaskContainer, tasks: Task[]) => {
    return tasks.filter((task) => task.containerId === container.containerId);
  };

  return (
    <>
      <span className={styles.projectNameWrapper}>
        <h2 className={styles.projectName}>{project[0].projectName}</h2>
        {project.length ? (
          <Dropdown
            options={[
              {
                title: "toIdb",
                onClick: () => createProject(project[0]),
              },
              {
                title: "rename",
                onClick: () => setShowEditModal(true),
              },
              {
                title: "delete",
                onClick: () => setShowDeleteModal(true),
              },
            ]}
          />
        ) : null}
      </span>
      <div className={styles.managerContainer} onMouseLeave={handleDragCancel}>
        {!!project.length ? (
          containers?.map((container, index) => {
            return (
              <TasksContainer
                key={index}
                tasks={filteredTasks(container, tasks)}
                projectId={project[0].projectId}
                containerName={container.containerName}
                containerId={container.containerId}
                dispatch={dispatch}
                handleDrag={handleDrag}
                handleDragStart={handleDragStart}
                handleMouseDown={handleMouseDown}
                dragging={dragging}
                nextIndex={nextIndex}
                toContainer={toContainer}
              />
            );
          })
        ) : (
          <h3 style={{ color: "white", fontSize: "4rem" }}>No projects yet!</h3>
        )}
      </div>
      <Modal
        width={300}
        onCancel={() => setShowDeleteModal(false)}
        visible={showDeleteModal}
        onConfirm={() =>
          dispatch({
            type: "DELETE_PROJECT",
            payload: { projectId: state[projectIndex]?.projectId },
          })
        }
      />
      <Modal
        width={700}
        onCancel={() => setShowEditModal(false)}
        visible={showEditModal}
      >
        <div>
          <input onChange={(e) => setProjectName(e.target.value)} />
          <button
            onClick={() => {
              dispatch({
                type: "RENAME_PROJECT",
                payload: {
                  projectId: state[projectIndex]?.projectId,
                  projectName: projectName,
                },
              });
            }}
          >
            change Name
          </button>
        </div>
      </Modal>
    </>
  );
}
export default TaskManager;
