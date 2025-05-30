import { useCallback, useRef, useState } from "react";
import type { AppDispatch } from "../../../store/configureStore";
import { clientMoveTask } from "../../../store/slices/taskReducer";
import { getTaskPosition } from "../util/getTaskPosition";
import { DragItem, HandleDrag, HandleDragOver, HandleDragStart, Task } from "../model/task";
import autoScroll from "../util/autoScroll";

const useDragAndDrop = (dispatch: AppDispatch, tasks: Task[]) => {
  const [dragging, setDragging] = useState(false);
  const [toContainer, setToContainer] = useState("");
  const [nextIndex, setNextIndex] = useState<null | number>(0);

  const savedTaskId = useRef("");
  const originalPosition = useRef({ container: "", index: 0 });
  const dragItemPosition = useRef<DragItem>({ container: "", index: 0 });
  const dragItemNode = useRef<HTMLElement | null>(null);
  const isDragging = useRef(false);

  const position = useRef({ left: 0, top: 0 });
  const cloneElement = useRef<HTMLElement | null>();

  const initialCloneStyles = (top: number, left: number, width: number) => {
    return {
      position: "absolute",
      top: `${top}px`,
      left: `${left}px`,
      width: `${width}px`,
      boxShadow: `0px 0px 8px 2px rgb(110, 110, 110)`,
      transition: "transform 250ms",
      pointerEvents: "none",
    };
  };

  const handleMouseUp = () => {
    if (cloneElement.current) {
      cloneElement.current.remove();
      cloneElement.current = null;
    }

    if (dragItemNode.current) {
      dragItemNode.current.removeAttribute("style");
    }

    document.body.style.cursor = "initial";
    handleDragEnd();
  };

  const handleMouseMove = (event: PointerEvent) => {
    if (!isDragging.current) {
      return;
    }

    const x = event.clientX + position.current.left;
    const y = event.clientY + position.current.top;

    if (cloneElement.current) {
      cloneElement.current.style.left = `${x}px`;
      cloneElement.current.style.top = `${y}px`;
    }
  };

  const handlePointerDown = (
    e: React.PointerEvent<HTMLLIElement>,
    taskItem: HTMLLIElement | null,
    containerId: string,
    index: number,
    taskId: string
  ) => {
    if (taskItem == null) return;

    e.preventDefault();
    e.stopPropagation();

    if ((e.target as HTMLLIElement).hasPointerCapture(e.pointerId)) {
      (e.target as HTMLLIElement).releasePointerCapture(e.pointerId);
      navigator.vibrate(50);
    }

    dragItemNode.current = taskItem;
    isDragging.current = true;
    handleDragStart(containerId, index, taskId);

    const { left, top, width } = taskItem.getBoundingClientRect();
    const offsetX = left - e.clientX;
    const offsetY = top - e.clientY;
    position.current = { top: offsetY, left: offsetX };

    const clone = dragItemNode?.current.cloneNode(true) as HTMLLIElement;

    Object.assign(clone.style, initialCloneStyles(top, left, width));
    document.body.style.cursor = "grabbing";
    document.body.appendChild(clone);
    cloneElement.current = clone;

    if (isDragging) {
      document.addEventListener("pointermove", handleMouseMove);
      document.addEventListener("pointerup", handleMouseUp);

      setTimeout(() => {
        if (cloneElement.current) {
          cloneElement.current.style.transform = "scale(0.95)";
        }
      }, 5);
    }
  };

  const handleDragStart: HandleDragStart = useCallback((container, index, taskId) => {
    originalPosition.current = { container, index };
    dragItemPosition.current = { container, index };
    savedTaskId.current = taskId;

    setToContainer(container);
    setNextIndex(index);
    setDragging(true);
  }, []);

  const handleDrag =
    (state: Task[]): HandleDrag =>
    (e, ref, container) => {
      if (!isDragging.current) {
        return;
      }

      const target = ref.current || (e.target as HTMLElement);
      const scrollContainer = target.querySelector("ul");
      const draggableElements = target.querySelectorAll(".task");

      const mappedPositions = [...draggableElements]
        .filter((_, index) => {
          if (container === dragItemPosition.current?.container) {
            return index !== dragItemPosition.current?.index;
          } else {
            return index + 1;
          }
        })
        .map((element) => {
          const rect = element.getBoundingClientRect();
          const position = Math.round(e.clientY - rect.top - rect.height / 2);
          return position;
        });

      const getIndex = mappedPositions.reduce((acc, item, index) => {
        if (item > 0) {
          return index + 1;
        }
        return acc;
      }, 0);

      setToContainer(container);
      setNextIndex(getIndex);
      autoScroll(scrollContainer, false, e);
      handleDragOver(container, getIndex, state);
    };

  const handleDragOver: HandleDragOver = useCallback(
    (container, index, state) => {
      if (
        dragItemPosition.current.container === container &&
        dragItemPosition.current.index === index
      ) {
        return;
      }

      const updatedTask = getTaskPosition({
        state,
        toContainerId: container,
        fromContainerId: dragItemPosition.current?.container,
        toIndex: index,
        fromIndex: dragItemPosition.current?.index,
        taskId: savedTaskId.current,
      });

      if (!updatedTask) {
        return;
      }

      dispatch(clientMoveTask(updatedTask));
      dragItemPosition.current = { container, index };
    },
    [dispatch]
  );

  const handleDragCancel = (state: Task[]) => () => {
    if (!dragging) return;

    const { container, index } = originalPosition.current;
    setToContainer(container);
    setNextIndex(index);

    const updatedTask = getTaskPosition({
      state,
      toContainerId: container,
      fromContainerId: dragItemPosition.current?.container,
      toIndex: index,
      fromIndex: dragItemPosition.current?.index,
      taskId: savedTaskId.current,
    });

    if (!updatedTask) {
      return;
    }

    dispatch(clientMoveTask(updatedTask));
    dragItemPosition.current = { container, index };
  };

  const handleDragEnd = () => {
    savedTaskId.current = "";
    isDragging.current = false;
    dragItemNode.current = null;
    setNextIndex(null);
    setDragging(false);

    document.removeEventListener("pointermove", handleMouseMove);
    document.removeEventListener("pointerup", handleMouseUp);
  };

  return {
    handleDrag: handleDrag(tasks),
    handleDragStart,
    handlePointerDown,
    handleDragCancel: handleDragCancel(tasks),
    dragging,
    toContainer,
    nextIndex,
    currentlyDragging: savedTaskId.current,
  };
};

export default useDragAndDrop;
