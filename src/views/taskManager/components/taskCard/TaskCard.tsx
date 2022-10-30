import { clsx } from "clsx";
import { useState } from "react";
import useOutsideClick from "../../../../hooks/useOutsideClick";
import styles from "./styles.module.scss";

interface TaskProps {
  task: { name?: string; description?: string; id: string };
  dataTestId?: string;
  index: number;
  container: string;
  dragging: boolean;
  saveTask: (
    container: string,
    id: string,
    name: string,
    description: string
  ) => void;
  handleDragStart: (
    e: React.DragEvent<HTMLElement>,
    container: string,
    index: number
  ) => void;
}
function TaskCard({
  task,
  dataTestId,
  index,
  container,
  dragging,
  saveTask,
  handleDragStart,
}: TaskProps) {
  const { name, description, id } = task;
  const [nameField, setNameField] = useState(false);
  const [descriptionField, setDescriptionField] = useState(false);

  const [nameInput, setNameInput] = useState(name || "");
  const [descriptionInput, setDescriptionInput] = useState(description || "");

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
      if (nameInput.length || descriptionInput.length) {
        saveTask(container, id, nameInput, descriptionInput);
      }
    }
  };
  const handleDescriptionKeypress = (e: React.KeyboardEvent<HTMLElement>) => {
    if ((e.key === "Enter" && !e.shiftKey) || e.key === "Escape") {
      setDescriptionField((prevState) => (prevState = false));
      if (nameInput.length || descriptionInput.length) {
        saveTask(container, id, nameInput, descriptionInput);
      }
    }
  };

  return (
    <div
      role="taskItem"
      className={styles.taskWrapper}
      data-testid={dataTestId}
      draggable
      onDragStart={(e: React.DragEvent<HTMLElement>) =>
        handleDragStart(e, container, index)
      }
      id={dragging ? "dragging" : ""}
    >
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
          {nameInput ? nameInput : "Task name"}
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
          {descriptionInput ? descriptionInput : "Task description:"}
        </button>
      )}
    </div>
  );
}
export default TaskCard;
