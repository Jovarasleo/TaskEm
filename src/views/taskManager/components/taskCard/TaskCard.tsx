import { FocusEvent, useState, useRef, useEffect } from "react";
import { clsx } from "clsx";
import {
  DragItem,
  handleDragStart,
  Task,
  Actions,
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
  dispatch: (action: Actions) => void;
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
  dispatch,
  handleDragStart,
}: TaskProps) {
  const { value, id } = task;
  const [inputField, setInputField] = useState(false);
  const [input, setInput] = useState(value || "");
  const textAreaRef = useRef<HTMLElement | null>(null);
  const outsideClickRef = useRef<HTMLElement | null>(null);

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

  useOutsideClick(closeTextBoxes, outsideClickRef);

  const handleDescriptionClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setInputField(true);
  };
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "0px";
      const scrollHeight = textAreaRef.current.scrollHeight;
      textAreaRef.current.style.height = scrollHeight + "px";
    }
  }, [textAreaRef, input, inputField]);

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
  function moveCursorToEnd(e: FocusEvent) {
    const target = e.target as HTMLTextAreaElement;
    target.selectionStart = target.value.length;
  }
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
      draggable={!inputField}
      onDragStart={(e: React.DragEvent<HTMLElement>) => {
        handleDragStart(e, container, index);
      }}
    >
      <div>{`# ${index + 1}`}</div>
      <button
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
        <div
          className={clsx(styles.button, styles.taskDescription)}
          onClick={(e) => handleDescriptionClick(e)}
        >
          {input ? input : "Task description:"}
        </div>
      )}
    </div>
  );
}
export default TaskCard;
