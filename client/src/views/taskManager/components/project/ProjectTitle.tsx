import { useState, useRef } from "react";
import { FiEdit3 } from "react-icons/fi";
import useOutsideClick from "../../../../hooks/useOutsideClick";
import { Project } from "../../model/task";
import "./project.css";

interface Props {
  project: Project;
  setName: (name: string) => void;
}

const ProjectTitle = ({ project, setName }: Props) => {
  const currentProjectName = project.projectName;
  const outsideClickRef = useRef<HTMLElement | null>(null);

  const [projectName, setProjectName] = useState("");
  const [error, setError] = useState<null | string>("");
  const [editName, setEditName] = useState(false);

  useOutsideClick(() => saveChanges(projectName), [outsideClickRef]);

  const saveChanges = (updatedName: string) => {
    if (!editName) {
      return;
    }

    if (projectName === currentProjectName) {
      return setEditName(false);
    }

    const trimmedName = updatedName.trim();

    if (!trimmedName.length) {
      return setError("missing value");
    }

    setEditName(false);
    setName(trimmedName);
    setProjectName("");
    setError(null);
  };

  return (
    <span className="projectNameWrapper" ref={outsideClickRef}>
      {editName ? (
        <div className="projectName">
          <input
            value={projectName}
            className="projectNameInput"
            onChange={(e) => setProjectName(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? saveChanges(projectName) : null)}
          />
          <FiEdit3 className="editButton" onClick={() => saveChanges(projectName)} />
        </div>
      ) : (
        <h2 className="mb-2">
          {currentProjectName}
          <FiEdit3
            onClick={() => {
              setEditName(true);
              setProjectName(currentProjectName);
            }}
          />
        </h2>
      )}
      {error && <p>{error}</p>}
    </span>
  );
};

export default ProjectTitle;
