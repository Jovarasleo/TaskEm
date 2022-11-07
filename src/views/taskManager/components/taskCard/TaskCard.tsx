import { useState } from "react";
import { clsx } from "clsx";
import {
  DragItem,
  SaveTask,
  handleDragStart,
  Task,
} from "views/taskManager/model/task";
import useOutsideClick from "../../../../hooks/useOutsideClick";
import styles from "./styles.module.scss";

interface TaskProps {
  dataTestId?: string;
  task: Task;
  index: number;
  container: string;
  dragging: boolean;
  nextPosition: null | number;
  arrayLength: number;
  toContainer: string;
  dragItem: DragItem | null;
  saveTask: SaveTask;
  handleDragStart: handleDragStart;
}

function TaskCard({
  task,
  dataTestId,
  index,
  container,
  dragging,
  nextPosition,
  arrayLength,
  toContainer,
  dragItem,
  saveTask,
  handleDragStart,
}: TaskProps) {
  const { name, description, id } = task;
  const [nameField, setNameField] = useState(false);
  const [descriptionField, setDescriptionField] = useState(false);

  const [nameInput, setNameInput] = useState(name || "");
  const [descriptionInput, setDescriptionInput] = useState(description || "");

  const closeTextBoxes = () => {
    setDescriptionField(false);
    setNameField(false);
  };

  const ref = useOutsideClick(closeTextBoxes);

  const handleNameClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setNameField(true);
  };
  const handleDescriptionClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDescriptionField(true);
  };
  const handleNameKeypress = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter" || e.key === "Escape") {
      setNameField(false);
      if (nameInput.length || descriptionInput.length) {
        saveTask(container, id, nameInput, descriptionInput);
      }
    }
  };
  const handleDescriptionKeypress = (e: React.KeyboardEvent<HTMLElement>) => {
    if ((e.key === "Enter" && !e.shiftKey) || e.key === "Escape") {
      setDescriptionField(false);
      if (nameInput.length || descriptionInput.length) {
        saveTask(container, id, nameInput, descriptionInput);
      }
    }
  };

  const pointer = () => {
    if (dragging && toContainer === container) {
      if (nextPosition === index) {
        return "before";
      }
      if (nextPosition === index + 1 && nextPosition >= arrayLength) {
        return "after";
      } else return "";
    } else return "";
  };

  const getClass = pointer();

  return (
    <div
      role="taskItem"
      className={clsx(
        styles.taskWrapper,
        styles[getClass],
        dragging && styles.removePointer,
        dragItem?.index === index &&
          dragItem?.container === container &&
          styles.current
      )}
      data-testid={dataTestId}
      draggable={!descriptionField && !nameField}
      onDragStart={(e: React.DragEvent<HTMLElement>) => {
        handleDragStart(e, container, index);
      }}
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
