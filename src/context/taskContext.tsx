import { createContext, useReducer, useState, useEffect } from "react";
import { taskReducer } from "../views/taksManager/reducers/taskReducer";
import { TaskContainers, Actions } from "../views/taksManager/model/task";

const initialState: TaskContainers = {
  todo: [],
  progress: [],
  done: [],
};

const PROJECT_MANAGER = "PROJECT_MANAGER";

export interface TasksContext {
  state: TaskContainers;
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
    localStorage
      ? JSON.parse(localStorage)
      : {
          project: initialState,
        }
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
    const newObj = { ...projects, [value]: initialState };
    setProjects((prevValue: TaskContainers) => ({ ...prevValue, ...newObj }));
    window.localStorage.setItem(PROJECT_MANAGER, JSON.stringify(newObj));
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
