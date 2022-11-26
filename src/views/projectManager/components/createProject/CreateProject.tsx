import { useState } from "react";
function CreateProject({ selectProject }: any) {
  const [projectName, setProjectName] = useState("");
  const getProject = window.localStorage.getItem("PROJECT_MANAGER");
  const projectsObj = getProject ? JSON.parse(getProject) : {};
  const addProject = (value: string) => {
    console.log({ projectsObj });

    const newProject = {
      todo: [],
      progress: [],
      done: [],
    };
    projectsObj[value] = newProject;

    window.localStorage.setItem("PROJECT_MANAGER", JSON.stringify(projectsObj));
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
      {Object.keys(projectsObj).map((project: any) => {
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
