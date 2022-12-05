import TaskContext, { TasksContext } from "../../../../context/taskContext";
import { useState, useReducer, useEffect, useContext } from "react";
import { TaskContainers } from "../../../../views/projectManager/model/task";
import { taskReducer } from "../../reducers/taskReducer";

function CreateProject() {
  const {
    state,
    dispatch,
    projects,
    selectProject,
    selectedProject,
    setSelectedProject,
    setProjects,
    addProject,
  } = useContext(TaskContext) as TasksContext;
  const [projectName, setProjectName] = useState("");

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
    </>
  );
}
export default CreateProject;
