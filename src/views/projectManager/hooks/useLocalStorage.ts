import { useEffect } from "react";
import { TaskContainers } from "../model/task";

const useLocalStorage = (project: string, state: TaskContainers) => {
  useEffect(() => {
    const getProjectManager = window.localStorage.getItem("PROJECT_MANAGER");
    const projects = getProjectManager && JSON.parse(getProjectManager);
    const newProject = { ...projects, [project]: state };
    console.log(newProject);
    window.localStorage.setItem("PROJECT_MANAGER", JSON.stringify(newProject));
  }, [state, project]);
};

export default useLocalStorage;
