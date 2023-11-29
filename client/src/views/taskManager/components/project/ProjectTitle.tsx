import { useState, useRef } from "react";
import styles from "./styles.module.scss";
import { FiEdit3 } from "react-icons/fi";
import { Project } from "../../model/task";
import useOutsideClick from "../../../../hooks/useOutsideClick";

interface Props {
  project: Project;
  setName: (name: string) => void;
}

const ProjectTitle = ({ project, setName }: Props) => {
  const [projectName, setProjectName] = useState(project.projectName);
  const [error, setError] = useState("");
  const [editName, setEditName] = useState(false);
  const outsideClickRef = useRef<HTMLElement | null>(null);

  const saveChanges = (updatedName: string) => {
    if (!editName) {
      return;
    }

    if (projectName === project.projectName) {
      return setEditName(false);
    }

    const trimmed = updatedName.trim();
    if (!trimmed.length) {
      return setError("missing value");
    }

    setEditName(false);
    setName(updatedName);
    setError("");
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
          {project.projectName}
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
