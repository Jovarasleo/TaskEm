import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/configureStore";
import TasksContainer from "./components/container/TasksContainer";
import TaskCard from "./components/task/TaskCard";
import { useDnd } from "./hooks/useDnd";
import { Task, TaskContainer } from "./model/task";
import "./taskManager.css";

function TaskManager() {
  const dispatch: AppDispatch = useDispatch();
  const { data: containers } = useSelector((state: RootState) => state.container);
  const { data: tasks } = useSelector((state: RootState) => state.task);
  const { data: projects, selected, loading } = useSelector((state: RootState) => state.project);
  const [temporaryTasks, setTemporaryTasks] = useState(tasks);
  useEffect(() => {
    setTemporaryTasks(tasks);
  }, [tasks]);
  // const { handleDrag, handlePointerDown, handleDragCancel, dragging, currentlyDragging } =
  //   useDragAndDrop(dispatch, tasks);

  const { activeTask, handleDragStart, handleDragOver, handleDragEnd } = useDnd(
    dispatch,
    temporaryTasks,
    containers,
    setTemporaryTasks
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

  if ((!projects.length && !loading) || !currentProject) {
    return <h3 className="text-white text-3xl">No task boards..</h3>;
  }

  return (
    <DndContext
      key={currentProject.projectId}
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      // autoScroll={{ layoutShiftCompensation: true }}
      collisionDetection={closestCenter}
      // onDragCancel={handleDragCancel}

      measuring={{
        droppable: { strategy: MeasuringStrategy.Always },
      }}
    >
      <section key={currentProject.projectId} className="managerContainer">
        {containers.map((container) => {
          return (
            <TasksContainer
              key={container.containerId}
              tasks={containerTasks(container, temporaryTasks)}
              tasksCount={temporaryTasks.length}
              projectId={currentProject?.projectId}
              containerName={container.containerName}
              containerId={container.containerId}
              dispatch={dispatch}
            />
          );
        })}
        <DragOverlay>
          {activeTask ? (
            <TaskCard
              task={activeTask}
              dataTestId={activeTask.taskId}
              dispatch={dispatch}
              taskId={activeTask.taskId}
            />
          ) : null}
        </DragOverlay>
      </section>
    </DndContext>
  );
}
export default TaskManager;
