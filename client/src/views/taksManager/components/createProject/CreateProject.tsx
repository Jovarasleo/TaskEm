import Button from "@components/button/Button";
import styles from "./styles.module.scss";
import useCreateProject from "../../hooks/useCreateProject";
import { Project } from "../../model/task";

function CreateProject() {
  const {
    state,
    projectName,
    projectIndex,
    handleProjectName,
    setSelectedProjectId,
    handleAddProject,
  } = useCreateProject();

  return (
    <section className={styles.createProjectWrapper}>
      <h3>Select project:</h3>
      {state.map((project: Project, index) => {
        return (
          <Button
            key={project.projectId}
            type="select"
            className={index === projectIndex ? styles.selectedProject : ""}
            onClick={() => {
              setSelectedProjectId(project.projectId);
            }}
          >
            {project.projectName}
          </Button>
        );
      })}
      <div>
        <input
          type="text"
          onChange={(e) => handleProjectName(e.target.value)}
          value={projectName}
        />
        <Button onClick={() => handleAddProject()}>Create Project</Button>
      </div>
    </section>
  );
}
export default CreateProject;
