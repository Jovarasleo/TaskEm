import { clsx } from "clsx";
import { useState } from "react";
import useOutsideClick from "../../../../hooks/useOutsideClick";
import styles from "./styles.module.scss";

interface TaskProps {
  dataTestId?: string;
}
function Task({ dataTestId }: TaskProps) {
  const [nameField, setNameField] = useState(false);
  const [descriptionField, setDescriptionField] = useState(false);

  const [nameInput, setNameInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");

  const closeTextBoxes = () => {
    setDescriptionField((prevState) => (prevState = false));
    setNameField((prevState) => (prevState = false));
  };

  const ref = useOutsideClick(closeTextBoxes);

  const handleNameClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setNameField((prevState) => (prevState = true));
  };
  const handleDescriptionClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDescriptionField((prevState) => (prevState = true));
  };
  const handleNameKeypress = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter" || e.key === "Escape") {
      setNameField((prevState) => (prevState = false));
    }
  };
  const handleDescriptionKeypress = (e: React.KeyboardEvent<HTMLElement>) => {
    if ((e.key === "Enter" && !e.shiftKey) || e.key === "Escape") {
      setDescriptionField((prevState) => (prevState = false));
    }
  };

  return (
    <div className={styles.taskWrapper} data-testid={dataTestId}>
      {nameField ? (
        <textarea
          autoFocus
          className={clsx(styles.textarea, styles.taskName)}
          onChange={(e) => setNameInput(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => handleNameKeypress(e)}
          placeholder="Task name.."
          value={nameInput}
          ref={ref}
        />
      ) : (
        <button
          className={clsx(styles.button, styles.taskName)}
          onClick={(e) => handleNameClick(e)}
        >
          {nameInput.length ? nameInput : "Task name"}
        </button>
      )}
      {descriptionField ? (
        <textarea
          autoFocus
          className={clsx(styles.textarea, styles.taskDescription)}
          onChange={(e) => setDescriptionInput(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => handleDescriptionKeypress(e)}
          placeholder="Describe task here..."
          value={descriptionInput}
          ref={ref}
        />
      ) : (
        <button
          className={clsx(styles.button, styles.taskDescription)}
          onClick={(e) => handleDescriptionClick(e)}
        >
          {descriptionInput.length ? descriptionInput : "Task description:"}
        </button>
      )}
    </div>
  );
}
export default Task;
