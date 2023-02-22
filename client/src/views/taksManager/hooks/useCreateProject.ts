import { useState, useContext } from "react";
import TaskContext, { TasksContext } from "../../../context/taskContext";

const useCreateProject = () => {
  const { projects, selectProject, addProject } = useContext(
    TaskContext
  ) as TasksContext;
  const [projectName, setProjectName] = useState("");

  const handleProjectName = (value: string) => {
    setProjectName(value);
  };

  const handleAddProject = () => {
    const savedProjects = Object.keys(projects).filter(
      (project) => project === projectName
    );

    if (!savedProjects.length) {
      addProject(projectName);
    } else {
      console.error("project exists");
    }
  };

  return {
    projects,
    projectName,
    handleProjectName,
    selectProject,
    handleAddProject,
  };
};

export default useCreateProject;
