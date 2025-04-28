import { clsx } from "clsx";
import { FocusEvent, useRef, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BsCheckLg, BsXLg } from "react-icons/bs";
import useOutsideClick from "../../../../hooks/useOutsideClick";
import useContainerHeight from "../../hooks/useContainerHeight";
import { Task } from "../../model/task";
import Button from "../../../../components/button/Button";
import { AppDispatch } from "../../../../store/configureStore";
import { clientDeleteTask, clientEditTask } from "../../../../store/slices/taskReducer";
import { isMobile } from "../../../..";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import "./taskCard.css";

interface TaskProps {
  dataTestId?: string;
  task: Task;
  index: number;
  container: string;
  dragging: boolean;
  currentlyDragging: string;
  dispatch: AppDispatch;
  handlePointerDown: (
    e: React.PointerEvent<HTMLLIElement>,
    taskItem: HTMLLIElement | null,
    container: string,
    index: number,
    taskId: string
  ) => void;
}

const HOLD_THRESHOLD = isMobile ? 150 : 0;

function TaskCard({
  dataTestId,
  task,
  index,
  container,
  dragging,
  currentlyDragging,
  dispatch,
  handlePointerDown,
}: TaskProps) {
  const { value, taskId } = task;
  const [inputField, setInputField] = useState(false);
  const [input, setInput] = useState(value || "");
  const [confirmDeletion, setConfirmDeletion] = useState(false);

  const textAreaRef = useRef<HTMLElement | null>(null);
  const outsideClickRef = useRef<HTMLElement | null>(null);
  const deleteButtonRef = useRef<HTMLDivElement>(null);

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
    dispatch(clientEditTask({ ...task, value: input }));
    setInputField(false);
  };

  const handleKeypress = (e: React.KeyboardEvent<HTMLElement>) => {
    if ((e.key === "Enter" && !e.shiftKey) || e.key === "Escape") {
      dispatch(clientEditTask({ ...task, value: input }));
      setInputField(false);
    }
  };

  const moveCursorToEnd = (e: FocusEvent) => {
    const target = e.target as HTMLTextAreaElement;
    target.selectionStart = target.value.length;
  };

  // useContainerHeight(textAreaRef, input, inputField);
  // useOutsideClick(closeTextBoxes, [outsideClickRef]);
  // useOutsideClick(() => handleConfirmDeletion(false), [deleteButtonRef]);

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task.taskId,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      className={clsx("task", dragging && currentlyDragging === task.taskId ? "draggable" : "")}
      style={style}
      {...listeners}
      {...attributes}
      data-testid={dataTestId}
    >
      <span className="taskIndex">{`# ${task?.count}`}</span>
      <div
        className={clsx("deleteButton", confirmDeletion && "confirmationView")}
        ref={deleteButtonRef}
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          handleConfirmDeletion(true);
        }}
      >
        {confirmDeletion ? (
          <>
            <Button className="confirmationButton" onClick={() => dispatch(clientDeleteTask(task))}>
              <BsCheckLg />
            </Button>
            <Button className="confirmationButton" onClick={() => handleConfirmDeletion(false)}>
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
          className="textarea taskDescription"
          rows={1}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe task here..."
          value={input}
          ref={(el) => {
            textAreaRef.current = el;
            outsideClickRef.current = el;
          }}
        />
      ) : (
        <p
          role="paragraph"
          className="paragraph taskDescription"
          onClick={(e) => handleDescriptionClick(e)}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {input ? input : "Empty..."}
        </p>
      )}
    </li>
  );
}
export default TaskCard;
