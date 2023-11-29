import { useState, useRef } from "react";
import styles from "./styles.module.scss";
import { FiEdit3 } from "react-icons/fi";
import useOutsideClick from "../../../../hooks/useOutsideClick";
import { Project } from "../../model/task";

interface Props {
  project: Project;
  setName: (name: string) => void;
}

const ProjectTitle = ({ project, setName }: Props) => {
  const currentProjectName = project.projectName;
  const [projectName, setProjectName] = useState(currentProjectName);
  const [error, setError] = useState("");
  const [editName, setEditName] = useState(false);
  const outsideClickRef = useRef<HTMLElement | null>(null);

  const saveChanges = (updatedName: string) => {
    setProjectName(currentProjectName);

    if (!editName) {
      return;
    }

    if (projectName === currentProjectName) {
      return setEditName(false);
    }

    const trimmed = updatedName.trim();
    if (!trimmed.length) {
      return setError("missing value");
    }

    setEditName(false);
    setProjectName("");
    setName(updatedName);
  };

  useOutsideClick(() => saveChanges(projectName), outsideClickRef);

  return (
    <span className={styles.projectNameWrapper} ref={outsideClickRef}>
      {editName ? (
        <div className={styles.projectName}>
          <input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? saveChanges(projectName) : null)}
          />
          <FiEdit3 className={styles.editButton} onClick={() => saveChanges(projectName)} />
        </div>
      ) : (
        <h2 className={styles.projectName}>
          {currentProjectName}
          <FiEdit3
            className={styles.editButton}
            onClick={() => {
              setEditName(true);
            }}
          />
        </h2>
      )}
      {error && <p>{error}</p>}
    </span>
  );
};

export default ProjectTitle;
