import { FocusEvent, useState, useRef } from "react";
import { clsx } from "clsx";
import {
  DragItem,
  handleDragStart,
  Task,
  Actions,
} from "views/taskManager/model/task";
import useOutsideClick from "../../../../hooks/useOutsideClick";
import usePositionIndicator from "../../hooks/usePositionIndicator";
import useContainerHeight from "../../hooks/useContainerHeight";
import styles from "./styles.module.scss";

interface TaskProps {
  dataTestId?: string;
  task: Task;
  index: number;
  container: string;
  dragging: boolean;
  nextIndex: null | number;
  arrayLength: number;
  toContainer: string;
  dragItem: DragItem | null;
  dispatch: (action: Actions) => void;
  handleDragStart: handleDragStart;
}

function TaskCard({
  task,
  dataTestId,
  index,
  container,
  dragging,
  nextIndex,
  arrayLength,
  toContainer,
  dragItem,
  dispatch,
  handleDragStart,
}: TaskProps) {
  const { value, id } = task;
  const [inputField, setInputField] = useState(false);
  const [input, setInput] = useState(value || "");

  const textAreaRef = useRef<HTMLElement | null>(null);
  const outsideClickRef = useRef<HTMLElement | null>(null);

  const handleDescriptionClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setInputField(true);
  };

  const closeTextBoxes = () => {
    if (input.length) {
      dispatch({
        type: "SAVE_TASK",
        container,
        id,
        value: input,
      });
    }
    setInputField(false);
  };

  const handleKeypress = (e: React.KeyboardEvent<HTMLElement>) => {
    if ((e.key === "Enter" && !e.shiftKey) || e.key === "Escape") {
      if (input.length) {
        dispatch({
          type: "SAVE_TASK",
          container,
          id,
          value: input,
        });
      }
      setInputField(false);
    }
  };

  const moveCursorToEnd = (e: FocusEvent) => {
    const target = e.target as HTMLTextAreaElement;
    target.selectionStart = target.value.length;
  };

  const position = usePositionIndicator(
    toContainer,
    container,
    nextIndex,
    index,
    arrayLength
  );
  useContainerHeight(textAreaRef, input, inputField);
  useOutsideClick(closeTextBoxes, outsideClickRef);

  return (
    <div
      role="taskItem"
      className={clsx(
        styles.taskWrapper,
        styles[position],
        dragging && styles.removePointer,
        dragItem?.index === index &&
          dragItem?.container === container &&
          styles.current
      )}
      data-testid={dataTestId}
      draggable={!inputField}
      onDragStart={(e: React.DragEvent<HTMLElement>) => {
        handleDragStart(e, container, index);
      }}
    >
      <div>{`# ${index + 1}`}</div>
      <button
        role={"delete_task"}
        className={styles.deleteButton}
        onClick={() =>
          dispatch({ type: "DELETE_TASK", id: task.id, container: container })
        }
      >
        -
      </button>
      {inputField ? (
        <textarea
          autoFocus
          className={clsx(styles.textarea, styles.taskDescription)}
          rows={1}
          onChange={(e) => setInput(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => handleKeypress(e)}
          placeholder="Describe task here..."
          onFocus={(e) => moveCursorToEnd(e)}
          value={input}
          ref={(el) => {
            textAreaRef.current = el;
            outsideClickRef.current = el;
          }}
        />
      ) : (
        <p
          role="paragraph"
          className={clsx(styles.button, styles.taskDescription)}
          onClick={(e) => handleDescriptionClick(e)}
        >
          {input ? input : "Task description:"}
        </p>
      )}
    </div>
  );
}
export default TaskCard;
