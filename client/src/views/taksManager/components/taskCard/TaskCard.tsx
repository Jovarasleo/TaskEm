import { clsx } from "clsx";
import { FocusEvent, useRef, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BsCheckLg, BsXLg } from "react-icons/bs";
import useOutsideClick from "../../../../hooks/useOutsideClick";
import useContainerHeight from "../../hooks/useContainerHeight";
import { Task } from "../../model/task";
import Button from "../../../../components/button/Button";
import { AppDispatch } from "../../../../store/configureStore";
import { removeTask, editTask } from "../../../../store/slices/taskReducer";
import styles from "./styles.module.scss";

interface TaskProps {
  dataTestId?: string;
  task: Task;
  index: number;
  container: string;
  dragging: boolean;
  currentlyDragging: string;
  dispatch: AppDispatch;
  handleMouseDown: (
    e: React.MouseEvent<HTMLLIElement>,
    taskItem: HTMLLIElement | null,
    container: string,
    index: number,
    taskId: string
  ) => void;
}

function TaskCard({
  dataTestId,
  task,
  index,
  container,
  dragging,
  currentlyDragging,
  dispatch,
  handleMouseDown,
}: TaskProps) {
  const { value, taskId } = task;
  const [inputField, setInputField] = useState(false);
  const [input, setInput] = useState(value || "");
  const [confirmDeletion, setConfirmDeletion] = useState(false);

  const textAreaRef = useRef<HTMLElement | null>(null);
  const outsideClickRef = useRef<HTMLElement | null>(null);
  const deleteButtonRef = useRef<HTMLDivElement>(null);
  const taskItem = useRef<HTMLLIElement>(null);

  const handleConfirmDeletion = (confirm: boolean) => {
    if (confirm && !confirmDeletion) {
      setConfirmDeletion(true);
    } else {
      setConfirmDeletion(false);
    }
  };

  const handleDescriptionClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setInputField(true);
  };

  const closeTextBoxes = () => {
    dispatch(
      editTask({
        value: input,
        taskId: taskId,
      })
    );
    setInputField(false);
  };

  const handleKeypress = (e: React.KeyboardEvent<HTMLElement>) => {
    if ((e.key === "Enter" && !e.shiftKey) || e.key === "Escape") {
      dispatch(
        editTask({
          value: input,
          taskId: taskId,
        })
      );
      setInputField(false);
    }
  };

  const moveCursorToEnd = (e: FocusEvent) => {
    const target = e.target as HTMLTextAreaElement;
    target.selectionStart = target.value.length;
  };

  useContainerHeight(textAreaRef, input, inputField);
  useOutsideClick(closeTextBoxes, outsideClickRef);
  useOutsideClick(() => handleConfirmDeletion(false), deleteButtonRef);

  return (
    <li
      role="taskItem"
      ref={taskItem}
      className={clsx(
        styles.taskWrapper,
        dragging && currentlyDragging === task.taskId ? styles.draggable : ""
      )}
      tabIndex={0}
      onMouseDown={(e) => {
        handleMouseDown(e, taskItem.current, container, index, taskId);
      }}
      data-testid={dataTestId}
    >
      <span className={styles.taskIndex}>{`# ${task?.count}`}</span>
      <div
        role={"delete_task"}
        className={clsx(styles.deleteButton, confirmDeletion && styles.confirmationView)}
        ref={deleteButtonRef}
        tabIndex={0}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          handleConfirmDeletion(true);
        }}
      >
        {confirmDeletion ? (
          <>
            <Button
              type="button"
              className={styles.confirmationButton}
              onClick={() =>
                dispatch(
                  removeTask({
                    taskId,
                  })
                )
              }
            >
              <BsCheckLg />
            </Button>
            <Button
              className={styles.confirmationButton}
              onClick={() => handleConfirmDeletion(false)}
            >
              <BsXLg />
            </Button>
          </>
        ) : (
          <AiOutlineDelete />
        )}
      </div>
      {inputField ? (
        <textarea
          autoFocus
          spellCheck={false}
          className={clsx(styles.textarea, styles.taskDescription)}
          rows={1}
          onChange={(e) => setInput(e.target.value)}
          onMouseDown={(e) => e.stopPropagation()}
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
          className={clsx(styles.paragraph, styles.taskDescription)}
          onClick={(e) => handleDescriptionClick(e)}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {input ? input : "Task description:"}
        </p>
      )}
    </li>
  );
}
export default TaskCard;
