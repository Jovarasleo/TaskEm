import Button from "@components/button/Button";
import styles from "./styles.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { Project } from "../../model/task";
import { AppDispatch, RootState } from "../../../../store/configureStore";
import { createProject, selectProject } from "../../../../store/slices/projectReducer";
import { uid } from "../../../../util/uid";
import { createContainer } from "../../../../store/slices/containerReducer";
import { useState } from "react";
import { defaultContainers } from "../../model/containers";
import { useNavigate } from "react-router-dom";

function CreateProject() {
  const dispatch: AppDispatch = useDispatch();
  const projects = useSelector((state: RootState) => state.project);
  const [projectName, setProjectName] = useState("");
  const navigate = useNavigate();

  const handleProjectName = (value: string) => {
    setProjectName(value);
  };

  return (
    <section className={styles.createProjectWrapper}>
      <h3>Select project:</h3>
      {projects.data.map((project: Project) => {
        return (
          <Button
            key={project.projectId}
            type="select"
            className={
              project.projectId === projects?.selected?.projectId ? styles.selectedProject : ""
            }
            onClick={() => {
              navigate("/");
              dispatch(selectProject(project));
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
        <Button
          onClick={() => {
            const projectId = uid();
            dispatch(createProject({ projectId, projectName }));
            dispatch(createContainer(defaultContainers(projectId)));
          }}
        >
          Create Project
        </Button>
      </div>
    </section>
  );
}
export default CreateProject;
