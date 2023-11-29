import Button from "@components/button/Button";
import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../store/configureStore";
import { createContainer } from "../../../../store/slices/containerReducer";
import { createProject } from "../../../../store/slices/projectReducer";
import { uid } from "../../../../util/uid";
import { defaultContainers } from "../../model/containers";
import styles from "./styles.module.scss";
import clsx from "clsx";

function CreateProject() {
  const dispatch: AppDispatch = useDispatch();
  const [projectName, setProjectName] = useState("");
  const [addNew, setAddNew] = useState(false);

  const handleProjectName = (value: string) => {
    setProjectName(value);
  };

  const setName = (newProjectName: string) => {
    const projectId = uid();
    const trimmedProjectName = newProjectName.trim();

    if (!trimmedProjectName.length) {
      return;
    }

    dispatch(createProject({ projectId, projectName: trimmedProjectName }));
    dispatch(createContainer(defaultContainers(projectId)));

    handleProjectName("");
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
              onChange={(e) => handleProjectName(e.target.value)}
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
