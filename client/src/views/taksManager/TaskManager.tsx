import Dropdown from "@components/dropdown/Dropdown";
import { useState } from "react";
import { FiEdit3 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/configureStore";
import { deleteProject, renameProject } from "../../store/slices/projectReducer";
import TasksContainer from "./components/taskContainer/TasksContainer";
import useDragAndDrop from "./hooks/useDragAndDrop";
import { Task, TaskContainer } from "./model/task";
import styles from "./styles.module.scss";
import { deleteContainers } from "../../store/slices/containerReducer";
import { deleteTask } from "../../store/slices/taskReducer";

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
  const dispatch: AppDispatch = useDispatch();

  const currentProject = selectedProject ?? projects[0];

  const { handleDrag, handleMouseDown, handleDragCancel, dragging, currentlyDragging } =
    useDragAndDrop(dispatch, tasks);

  const [projectName, setProjectName] = useState("");

  const containerTasks = (container: TaskContainer, tasks: Task[]) => {
    return tasks.filter((task) => task.containerId === container.containerId);
  };

  const projectTasks = tasks.filter((task) => task.projectId === currentProject?.projectId);
  const projectContainers = containers.filter(
    (container) => container.projectId === currentProject?.projectId
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
                dispatch(renameProject({ ...currentProject, projectName }));
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
                  dispatch(deleteProject({ projectId: currentProject?.projectId }));
                  dispatch(deleteContainers(projectContainers));
                  dispatch(deleteTask(projectTasks));
                },
              },
            ]}
          />
        ) : null}
      </span>
      <div
        className={styles.managerContainer}
        onMouseLeave={handleDragCancel}
        key={currentProject?.projectId}
      >
        {containersLoading ? (
          <h2>Loading..</h2>
        ) : (
          projectContainers.map((container) => {
            return (
              <TasksContainer
                key={container.containerId}
                tasks={containerTasks(container, tasks)}
                tasksCount={projectTasks.length}
                projectId={currentProject?.projectId}
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
    </>
  );
}
export default TaskManager;
