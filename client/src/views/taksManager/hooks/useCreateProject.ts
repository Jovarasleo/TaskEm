import { useState, useContext } from "react";
import TaskContext, { TasksContext } from "../../../context/taskContext";

const useCreateProject = () => {
  const { state, projectIndex, setSelectedProjectId, addProject } = useContext(
    TaskContext
  ) as TasksContext;
  const [projectName, setProjectName] = useState("");

  const handleProjectName = (value: string) => {
    setProjectName(value);
  };

  const handleAddProject = () => {
    const savedProjects = Object.keys(state).filter(
      (project) => project === projectName
    );

    if (!savedProjects.length) {
      addProject(projectName);
    } else {
      console.error("project exists");
    }
  };

  return {
    state,
    projectName,
    projectIndex,
    handleProjectName,
    setSelectedProjectId,
    handleAddProject,
  };
};

export default useCreateProject;
