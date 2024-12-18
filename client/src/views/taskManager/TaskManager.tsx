import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/configureStore";
import { deleteProject, renameProject } from "../../store/slices/projectReducer";
import TasksContainer from "./components/container/TasksContainer";
import useDragAndDrop from "./hooks/useDragAndDrop";
import { Task, TaskContainer } from "./model/task";
import styles from "./styles.module.scss";
import { deleteContainers } from "../../store/slices/containerReducer";
import { deleteTask } from "../../store/slices/taskReducer";
import ProjectMenu from "./components/project/ProjectOptions";
import ProjectTitle from "./components/project/ProjectTitle";

function TaskManager() {
  const dispatch: AppDispatch = useDispatch();
  const { data: projects, selected: selectedProject } = useSelector(
    (state: RootState) => state.project
  );
  const { data: containers } = useSelector((state: RootState) => state.container);
  const { data: tasks } = useSelector((state: RootState) => state.task);

  const currentProject = selectedProject ?? projects[0];

  const { handleDrag, handlePointerDown, handleDragCancel, dragging, currentlyDragging } =
    useDragAndDrop(dispatch, tasks);

  const containerTasks = (container: TaskContainer, tasks: Task[]) => {
    return tasks.filter((task) => task.containerId === container.containerId);
  };

  const projectTasks = tasks.filter((task) => task.projectId === currentProject?.projectId);
  const projectContainers = containers.filter(
    (container) => container.projectId === currentProject?.projectId
  );

  if (!projects.length) {
    return <h3 style={{ color: "white", fontSize: "4rem" }}>No projects yet!</h3>;
  }

  return (
    <>
      <div className={styles.projectHeader}>
        <ProjectTitle
          project={{ ...currentProject }}
          setName={(projectName) => dispatch(renameProject({ ...currentProject, projectName }))}
        />
        {projects.length > 0 && (
          <ProjectMenu
            deleteTask={() => dispatch(deleteTask(projectTasks))}
            deleteContainers={() => dispatch(deleteContainers(projectContainers))}
            deleteProject={() => dispatch(deleteProject({ projectId: currentProject?.projectId }))}
          />
        )}
      </div>

      <div
        className={styles.managerContainer}
        onPointerLeave={handleDragCancel}
        key={currentProject?.projectId}
      >
        {projectContainers.map((container) => {
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
              handlePointerDown={handlePointerDown}
              dragging={dragging}
              currentlyDragging={currentlyDragging}
            />
          );
        })}
      </div>
    </>
  );
}
export default TaskManager;
