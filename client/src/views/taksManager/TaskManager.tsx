import Dropdown from "@components/dropdown/Dropdown";
import Modal from "@components/modal/Modal";
import { useEffect, useState } from "react";
import { FiEdit3 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/configureStore";
import { getContainersFromIdb } from "../../store/slices/containerReducer";
import {
  deleteProject,
  getProjectFromIdb,
  removeProjectFromIdb,
  renameProject,
  setProjects,
  syncProjects,
  updateProjectToIdb,
} from "../../store/slices/projectReducer";
import { fetchDataFromIndexedDB } from "../../store/slices/taskReducer";
import TasksContainer from "./components/taskContainer/TasksContainer";
import useDragAndDrop from "./hooks/useDragAndDrop";
import { Task, TaskContainer } from "./model/task";
import styles from "./styles.module.scss";
import { useGetProjectsQuery } from "../../api/project";
import { io } from "socket.io-client";

function TaskManager() {
  const {
    data: projects,
    selected: selectedProject,
    loading: projectsLoading,
  } = useSelector((state: RootState) => state.project);
  const { data: containers, loading: containersLoading } = useSelector(
    (state: RootState) => state.container
  );
  const { data: tasks } = useSelector((state: RootState) => state.task);
  const { userToken } = useSelector((state: RootState) => state.auth);
  const dispatch: AppDispatch = useDispatch();

  const currentProject = selectedProject ?? projects[0];

  useEffect(() => {
    dispatch(fetchDataFromIndexedDB());
    dispatch(getProjectFromIdb());
    dispatch(getContainersFromIdb());
    // dispatch(syncProjects());
  }, [dispatch]);

  // useEffect(() => {
  //   const socket = io("ws://127.0.0.1:3000", {
  //     reconnection: true,
  //     auth: {
  //       token: userToken,
  //     },
  //   });

  //   console.log("twice");

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  const {
    handleDrag,
    handleDragStart,
    handleMouseDown,
    handleDragCancel,
    dragging,
    nextIndex,
    toContainer,
    currentlyDragging,
  } = useDragAndDrop(dispatch, tasks);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [projectName, setProjectName] = useState("");

  const containerTasks = (container: TaskContainer, tasks: Task[]) => {
    return tasks.filter((task) => task.containerId === container.containerId);
  };

  const projectTasksCount = (projectId: string, tasks: Task[]) => {
    return tasks.filter((task) => task.projectId === projectId).length;
  };

  const projectContainers = containers.filter(
    (container) => container.projectId === currentProject.projectId
  );

  const [editName, setEditName] = useState(false);
  if (projectsLoading) {
    return <h3 style={{ color: "white", fontSize: "4rem" }}>Projects Loading...</h3>;
  }
  if (!projects.length) {
    return <h3 style={{ color: "white", fontSize: "4rem" }}>No projects yet!</h3>;
  }

  return (
    <>
      <span className={styles.projectNameWrapper}>
        {editName ? (
          <div className={styles.projectName}>
            <input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              contentEditable
            />
            <FiEdit3
              className={styles.editButton}
              onClick={() => {
                setEditName(false);
                dispatch(renameProject(projectName));
                dispatch(updateProjectToIdb(currentProject.projectId));
              }}
            />
          </div>
        ) : (
          <h2 className={styles.projectName}>
            {currentProject.projectName}
            <FiEdit3
              className={styles.editButton}
              onClick={() => {
                setEditName(true);
                setProjectName(currentProject.projectName);
              }}
            />
          </h2>
        )}

        {projects.length ? (
          <Dropdown
            options={[
              {
                title: "delete",
                onClick: () => {
                  dispatch(deleteProject());
                  dispatch(removeProjectFromIdb(currentProject.projectId));
                },
              },
            ]}
          />
        ) : null}
      </span>
      <div
        className={styles.managerContainer}
        onMouseLeave={handleDragCancel}
        key={currentProject.projectId}
      >
        {containersLoading ? (
          <h2>Loading..</h2>
        ) : (
          projectContainers.map((container) => {
            return (
              <TasksContainer
                key={container.containerId}
                tasks={containerTasks(container, tasks)}
                tasksCount={projectTasksCount(currentProject.projectId, tasks)}
                projectId={currentProject.projectId}
                containerName={container.containerName}
                containerId={container.containerId}
                dispatch={dispatch}
                handleDrag={handleDrag}
                handleMouseDown={handleMouseDown}
                dragging={dragging}
                currentlyDragging={currentlyDragging}
              />
            );
          })
        )}
      </div>
      <Modal
        width={300}
        onCancel={() => setShowDeleteModal(false)}
        visible={showDeleteModal}
        // onConfirm={() =>
        //   dispatch({
        //     type: "DELETE_PROJECT",
        //     payload: { projectId: state[projectIndex]?.projectId },
        //   })
        // }
      />
      <Modal width={700} onCancel={() => setShowEditModal(false)} visible={showEditModal}>
        <div>
          <input onChange={(e) => setProjectName(e.target.value)} />
          <button
          // onClick={() => {
          //   dispatch({
          //     type: "RENAME_PROJECT",
          //     payload: {
          //       projectId: state[projectIndex]?.projectId,
          //       projectName: projectName,
          //     },
          //   });
          // }}
          >
            change Name
          </button>
        </div>
      </Modal>
    </>
  );
}
export default TaskManager;
