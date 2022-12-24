import { useState, useContext } from "react";
import TaskContext, { TasksContext } from "../../../../context/taskContext";
import Button from "../../../../components/button/Button";
import styles from "./styles.module.scss";

function CreateProject() {
  const { projects, selectProject, addProject } = useContext(
    TaskContext
  ) as TasksContext;
  const [projectName, setProjectName] = useState("");

  return (
    <section className={styles.createProjectWrapper}>
      <h3>Select project:</h3>
      {Object.keys(projects).map((project: any) => {
        return (
          <Button
            key={project}
            type="select"
            onClick={() => {
              selectProject(project);
            }}
          >
            {project}
          </Button>
        );
      })}
      <div>
        <input
          type="text"
          onChange={(e) => setProjectName(e.target.value)}
          value={projectName}
        />
        <Button onClick={() => addProject(projectName)}>Create Project</Button>
      </div>
    </section>
  );
}
export default CreateProject;
