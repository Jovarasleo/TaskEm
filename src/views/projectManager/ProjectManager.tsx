import { useState, useReducer, useEffect } from "react";
import { TaskContainers } from "./model/task";
import { taskReducer } from "./reducers/taskReducer";
import TaskManger from "./components/taskManager/TaskManager";

const initialState: TaskContainers = {
  todo: [],
  progress: [],
  done: [],
};

function ProjectManager() {
  const localStorage = window.localStorage.getItem("PROJECT_MANAGER");
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

    if (selectedProject) {
      dispatch({ type: "SWITCH_PROJECT", payload: projects[project] });
    }
  };

  const [projectName, setProjectName] = useState("");

  useEffect(() => {
    const localStorage = window.localStorage.getItem("PROJECT_MANAGER");
    if (localStorage) {
      setProjects(JSON.parse(localStorage));
    }
  }, [selectedProject, state]);

  const addProject = (value: string) => {
    if (!value.length) return;
    const newObj = { ...projects, [value]: initialState };
    setProjects((prevValue: TaskContainers) => ({ ...prevValue, ...newObj }));
    window.localStorage.setItem("PROJECT_MANAGER", JSON.stringify(newObj));
  };
  return (
    <>
      <div>
        <input
          type="text"
          onChange={(e) => setProjectName(e.target.value)}
          value={projectName}
        />
        <button onClick={() => addProject(projectName)} style={{ padding: 5 }}>
          Create Project
        </button>
      </div>
      {Object.keys(projects).map((project: any) => {
        return (
          <button
            key={project}
            onClick={() => {
              selectProject(project);
            }}
          >
            {project}
          </button>
        );
      })}
      {selectedProject ? (
        <TaskManger
          project={selectedProject}
          state={state}
          dispatch={dispatch}
        />
      ) : null}
    </>
  );
}
export default ProjectManager;
