import { createContext, useEffect, useReducer, useRef, useState } from "react";
import { taskReducer } from "../views/taksManager/reducers/taskReducer";
import { Actions, Project } from "../views/taksManager/model/task";
import { uid } from "../util/uid";
import { getProjects } from "../db";

export const PROJECT_MANAGER = "PROJECT_MANAGER";

export interface TasksContext {
  state: Project[] | [];
  projectIndex: number;
  dispatch: (action: Actions) => void;
  setSelectedProjectId: (project: string) => void;
  addProject: (value: string) => void;
}

function findIndexById(projectId: string, array: Project[] | []) {
  return array.findIndex((project) => project.projectId === projectId);
}

const TaskContext = createContext<TasksContext | null>(null);

function TaskProvider({ children }: any) {
  // const localStorage = window.localStorage.getItem(PROJECT_MANAGER);
  // const projects = localStorage ? JSON.parse(localStorage) : [];
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // console.log({ projects });
  const [state, dispatch] = useReducer(taskReducer, projects);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [projectIndex, setProjectIndex] = useState(0);

  const returnProjects = async () => {
    try {
      setLoading(true);
      const value = await getProjects();
      setProjects(value);
      dispatch({ type: "SET_DATA", payload: value });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const selectProject = (projectId: string) => {
    const index = findIndexById(projectId, state);
    const previousProject = projectIndex - 1;
    if (index >= 0) {
      setProjectIndex(index);
    } else if (previousProject >= 0) {
      setProjectIndex(previousProject);
    } else setProjectIndex(0);
  };

  const addProject = (value: string) => {
    if (!value.length) return;

    const initialProject: Project = {
      projectName: "",
      projectId: "",
      containers: [
        {
          containerName: "todo",
          tasks: [],
        },
        {
          containerName: "progress",
          tasks: [],
        },
        {
          containerName: "done",
          tasks: [],
        },
      ],
      count: 0,
    };

    initialProject.projectName = value;
    initialProject.projectId = uid();
    dispatch({ type: "ADD_PROJECT", payload: initialProject });

    const localStorage = window.localStorage.getItem(PROJECT_MANAGER);
    const localArray = localStorage ? JSON.parse(localStorage) : [];
    const allProjects = [...localArray, initialProject];
    window.localStorage.setItem(PROJECT_MANAGER, JSON.stringify(allProjects));
    setSelectedProjectId(initialProject.projectId);
  };

  useEffect(() => {
    console.log(selectedProjectId);
    if (loading) {
      returnProjects();
    }
    // selectProject(selectedProjectId);
  }, [state, selectedProjectId, loading]);

  return (
    <TaskContext.Provider
      value={{
        state,
        projectIndex,
        dispatch,
        setSelectedProjectId,
        addProject,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export default TaskContext;
export { TaskProvider };
