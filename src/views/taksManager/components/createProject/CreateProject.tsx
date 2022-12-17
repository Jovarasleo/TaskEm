import TaskContext, { TasksContext } from "../../../../context/taskContext";
import { useState, useContext } from "react";
import styles from "./styles.module.scss";

function CreateProject() {
  const { projects, selectProject, addProject } = useContext(
    TaskContext
  ) as TasksContext;
  const [projectName, setProjectName] = useState("");

  return (
    <section className={styles.createProjectWrapper}>
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
            className={styles.selectProject}
            onClick={() => {
              selectProject(project);
            }}
          >
            {project}
          </button>
        );
      })}
    </section>
  );
}
export default CreateProject;
