import { createContext, useReducer, useState, useEffect } from "react";
import { taskReducer } from "../views/taksManager/reducers/taskReducer";
import {
  TaskContainers,
  Actions,
  TaskManager,
} from "../views/taksManager/model/task";

const initialState: TaskManager = {
  tasks: { todo: [], progress: [], done: [] },
  count: 0,
};

const PROJECT_MANAGER = "PROJECT_MANAGER";

export interface TasksContext {
  state: TaskManager;
  dispatch: (action: Actions) => void;
  projects: string[];
  selectProject: (project: string) => void;
  selectedProject: string;
  setSelectedProject: (projectsName: string) => void;
  setProjects: (projects: string[]) => void;
  addProject: (value: string) => void;
}

const TaskContext = createContext<TasksContext | null>(null);

function TaskProvider({ children }: any) {
  const localStorage = window.localStorage.getItem(PROJECT_MANAGER);
  const [projects, setProjects] = useState(
    localStorage ? JSON.parse(localStorage) : []
  );

  const DEFAULT_STATE = Object.keys(projects)[0];
  const [state, dispatch] = useReducer(taskReducer, projects[DEFAULT_STATE]);
  const [selectedProject, setSelectedProject] = useState(DEFAULT_STATE);

  const selectProject = (project: string) => {
    setSelectedProject(project);
    dispatch({ type: "SWITCH_PROJECT", payload: projects[project] });
  };

  const addProject = (value: string) => {
    if (!value.length) return;
    const newObj = { [value]: initialState };
    const newProjects = { ...projects, ...newObj };
    setProjects((prevValue: TaskManager) => ({
      ...prevValue,
      ...newProjects,
    }));
    window.localStorage.setItem(PROJECT_MANAGER, JSON.stringify(newProjects));
    dispatch({ type: "SWITCH_PROJECT", payload: newObj[value] });
    setSelectedProject(value);
  };

  useEffect(() => {
    const localStorage = window.localStorage.getItem(PROJECT_MANAGER);
    if (localStorage) {
      setProjects(JSON.parse(localStorage));
    }
  }, [state]);

  return (
    <TaskContext.Provider
      value={{
        state,
        dispatch,
        projects,
        selectProject,
        selectedProject,
        setSelectedProject,
        setProjects,
        addProject,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export default TaskContext;
export { TaskProvider };
