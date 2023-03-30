import { useDragAndDrop } from "./hooks/useDragAndDrop";
import useLocalStorage from "./hooks/useLocalStorage";
import TasksContainer from "./components/taskContainer/TasksContainer";
import TaskContext, { TasksContext } from "../../context/taskContext";
import { useContext, useState } from "react";
import styles from "./styles.module.scss";
import Button from "@components/button/Button";
import Dropdown from "@components/dropdown/Dropdown";
import clsx from "clsx";
import Modal from "@components/modal/Modal";
import useOutsideClick from "../../hooks/useOutsideClick";

function TaskManager() {
  const { state, dispatch, projectIndex } = useContext(
    TaskContext
  ) as TasksContext;

  useLocalStorage(state);
  const projectId = state.length ? state[projectIndex].projectId : null;

  const {
    handleDrag,
    handleDragStart,
    handleDragLeave,
    handleDragEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleAllowTransfer,
    dragging,
    nextIndex,
    toContainer,
    dragItem,
  } = useDragAndDrop(dispatch, projectId);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [projectName, setProjectName] = useState("");

  return (
    <>
      <span className={styles.projectNameWrapper}>
        <h2 className={styles.projectName}>{state[projectIndex]?.projectName}</h2>
        {state.length ? (
          <Dropdown
            options={[
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
      <div className={styles.managerContainer}>
        {state.length ? (
          state[projectIndex]?.containers?.map((container, index) => {
            return (
              <TasksContainer
                key={projectId + index}
                tasks={container.tasks}
                projectId={projectId}
                container={container.containerName}
                dispatch={dispatch}
                handleDrag={handleDrag}
                handleDragStart={handleDragStart}
                handleDragLeave={handleDragLeave}
                handleDragEnd={handleDragEnd}
                handleMouseDown={handleMouseDown}
                handleMouseMove={handleMouseMove}
                handleMouseUp={handleMouseUp}
                handleAllowTransfer={handleAllowTransfer}
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
