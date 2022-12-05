import TaskContext, { TasksContext } from "../../context/taskContext";
import { useContext } from "react";
import TaskManger from "./components/taskManager/TaskManager";

function ProjectManager() {
  const {
    state,
    dispatch,
    projects,
    selectProject,
    selectedProject,
    setSelectedProject,
    setProjects,
  } = useContext(TaskContext) as TasksContext;

  return (
    <TaskManger project={selectedProject} state={state} dispatch={dispatch} />
  );
}
export default ProjectManager;
