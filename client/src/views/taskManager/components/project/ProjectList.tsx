import Button from "@components/button/Button";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../../../store/configureStore";
import { selectProjectWithRelatedData } from "../../../../store/slices/projectReducer";
import { Project } from "../../model/task";
import styles from "./styles.module.scss";

function ProjectList() {
  const dispatch: AppDispatch = useDispatch();
  const projects = useSelector((state: RootState) => state.project);
  const navigate = useNavigate();

  if (!projects.data.length) {
    return (
      <section className={styles.selectProject}>
        <h3>No Projects Yet!</h3>
      </section>
    );
  }

  return (
    <section className={styles.selectProject}>
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
              dispatch(selectProjectWithRelatedData(project));
            }}
          >
            {project.projectName}
          </Button>
        );
      })}
    </section>
  );
}
export default ProjectList;
