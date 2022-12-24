import { useEffect } from "react";
import { TaskContainers } from "../model/task";

const initialState: TaskContainers = {
  todo: [],
  progress: [],
  done: [],
};

const useLocalStorage = (project: string, state: TaskContainers) => {
  const currentState = state ? state : initialState;
  useEffect(() => {
    const getProjectManager = window.localStorage.getItem("PROJECT_MANAGER");
    const projects = getProjectManager && JSON.parse(getProjectManager);
    const newProject = { ...projects, [project]: currentState };
    window.localStorage.setItem("PROJECT_MANAGER", JSON.stringify(newProject));
  }, [state, project]);
};

export default useLocalStorage;
