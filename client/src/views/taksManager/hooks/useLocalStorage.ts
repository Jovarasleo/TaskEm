import { useEffect } from "react";
import { TaskManager } from "../model/task";

const useLocalStorage = (project: string, state: TaskManager) => {
  useEffect(() => {
    if (!state) {
      return;
    }

    const getProjectManager = window.localStorage.getItem("PROJECT_MANAGER");
    const projects = getProjectManager && JSON.parse(getProjectManager);
    const newProject = { ...projects, [project]: state };
    window.localStorage.setItem("PROJECT_MANAGER", JSON.stringify(newProject));
  }, [state, project]);
};

export default useLocalStorage;
