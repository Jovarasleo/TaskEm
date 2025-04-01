import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/configureStore";
import TasksContainer from "./components/container/TasksContainer";
import useDragAndDrop from "./hooks/useDragAndDrop";
import { Task, TaskContainer } from "./model/task";
import styles from "./styles.module.scss";

function TaskManager() {
  const dispatch: AppDispatch = useDispatch();
  const { data: containers } = useSelector((state: RootState) => state.container);
  const { data: tasks } = useSelector((state: RootState) => state.task);
  const { data: projects, selected, loading } = useSelector((state: RootState) => state.project);
  const { handleDrag, handlePointerDown, handleDragCancel, dragging, currentlyDragging } =
    useDragAndDrop(dispatch, tasks);

  const currentProject = selected ?? projects[0];

  const containerTasks = (container: TaskContainer, tasks: Task[]) =>
    tasks.filter((task) => task.containerId === container.containerId);

  if (!projects.length && !loading) {
    return <h3 className="text-white text-3xl">No task boards..</h3>;
  }

  return (
    <section
      className={styles.managerContainer}
      onPointerLeave={handleDragCancel}
      key={currentProject?.projectId}
    >
      {containers.map((container) => {
        return (
          <TasksContainer
            key={container.containerId}
            tasks={containerTasks(container, tasks)}
            tasksCount={tasks.length}
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
    </section>
  );
}
export default TaskManager;
