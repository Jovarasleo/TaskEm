import {
  closestCenter,
  closestCorners,
  CollisionDetection,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/configureStore";
import TasksContainer from "./components/container/TasksContainer";
import TaskCard from "./components/task/TaskCard";
import { useDnd } from "./hooks/useDnd";
import useDragAndDrop from "./hooks/useDragAndDrop";
import { Task, TaskContainer } from "./model/task";
import styles from "./styles.module.css";
import { useCallback } from "react";

function TaskManager() {
  const dispatch: AppDispatch = useDispatch();
  const { data: containers } = useSelector((state: RootState) => state.container);
  const { data: tasks } = useSelector((state: RootState) => state.task);
  const { data: projects, selected, loading } = useSelector((state: RootState) => state.project);
  const { handleDrag, handlePointerDown, handleDragCancel, dragging, currentlyDragging } =
    useDragAndDrop(dispatch, tasks);

  const { activeTask, handleDragStart, handleDragOver, handleDragEnd } = useDnd(
    dispatch,
    tasks,
    containers
  );

  const currentProject = selected ?? projects[0];

  const containerTasks = (container: TaskContainer, tasks: Task[]) =>
    tasks.filter((task) => task.containerId === container.containerId);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!projects.length && !loading) {
    return <h3 className="text-white text-3xl">No task boards..</h3>;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <section
        key={currentProject?.projectId}
        className={styles.managerContainer}
        onPointerLeave={handleDragCancel}
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
        <DragOverlay>{activeTask ? <TaskCard task={activeTask} /> : null}</DragOverlay>
      </section>
    </DndContext>
  );
}
export default TaskManager;
