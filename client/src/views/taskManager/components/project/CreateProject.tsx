import Button from "@components/button/Button";
import clsx from "clsx";
import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../store/configureStore";
import { clientCreateProject } from "../../../../store/slices/projectReducer";
import { clientLoadTasks } from "../../../../store/slices/taskReducer";
import { uid } from "../../../../util/uid";
import { defaultContainers } from "../../model/containers";
import styles from "./styles.module.scss";
import { clientLoadContainers } from "../../../../store/slices/containerReducer";

function CreateProject() {
  const dispatch: AppDispatch = useDispatch();
  const [projectName, setProjectName] = useState("");
  const [addNew, setAddNew] = useState(false);

  const setName = (newProjectName: string) => {
    const projectId = uid();
    const projectName = newProjectName.trim();

    if (!projectName.length) {
      return;
    }

    const containers = defaultContainers(projectId);

    dispatch(
      clientCreateProject({
        project: {
          projectId,
          projectName,
        },
        containers,
      })
    );
    dispatch(clientLoadTasks([]));
    dispatch(clientLoadContainers(containers));

    setProjectName("");
    setAddNew(false);
  };

  return (
    <section className={styles.createProject}>
      <div
        onClick={() => setAddNew((prev) => !prev)}
        className={clsx(styles.addNew, addNew && styles.expanded)}
      >
        {addNew ? (
          <>
            <input
              type="text"
              onChange={(e) => setProjectName(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              value={projectName}
            />
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setName(projectName);
              }}
              className={styles.addProject}
            >
              <AiOutlinePlus />
            </Button>
          </>
        ) : (
          <p>Create New</p>
        )}
      </div>
    </section>
  );
}
export default CreateProject;
