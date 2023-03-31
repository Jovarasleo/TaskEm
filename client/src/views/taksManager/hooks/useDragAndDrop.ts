import {
  DragItem,
  HandleDrag,
  HandleDragOver,
  HandleDragStart,
} from "../model/task";
import { useRef, useState, useCallback } from "react";
import autoScroll from "../util/autoScroll";
import { Actions } from "../model/task";

export const useDragAndDrop = (
  dispatch: (action: Actions) => void,
  projectId: string | null
) => {
  const [dragging, setDragging] = useState(false);
  const [toContainer, setToContainer] = useState("");
  const [nextIndex, setNextIndex] = useState<null | number>(0);

  const savedTaskId = useRef("");
  const dragItem = useRef<DragItem>({ container: "", index: 0 });
  const dragItemNode = useRef<HTMLElement | null>(null);
  const dragtoIndex = useRef(0);
  const dragtoContainer = useRef("");
  const isDragging = useRef(false);

  const position = useRef({ left: 0, top: 0 });
  const cloneElement = useRef<HTMLElement | null>();

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

  const handleMouseMove = (event: any) => {
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
  function callback(e: any) {
    return handleMouseMove(e);
  }

  const handleMouseDown = (
    e: React.MouseEvent<HTMLLIElement>,
    taskItem: HTMLLIElement | null,
    container: string,
    index: number,
    taskId: string
  ) => {
    if (taskItem === null) return;

    e.preventDefault();
    e.stopPropagation();

    dragItemNode.current = taskItem;
    isDragging.current = true;
    handleDragStart(container, index, taskId);

    const { left, top, width } = taskItem.getBoundingClientRect();
    const offsetX = left - e.clientX;
    const offsetY = top - e.clientY;
    position.current = { top: offsetY, left: offsetX };

    const clone = dragItemNode?.current.cloneNode(true) as HTMLLIElement;

    clone.style.position = "absolute";
    clone.style.width = `${width}px`;
    clone.style.left = `${left}px`;
    clone.style.top = `${top}px`;
    clone.style.boxShadow = `0px 0px 6px 2px rgb(84, 84, 84)`;
    clone.style.pointerEvents = "none";
    document.body.style.cursor = "grabbing";
    document.body.appendChild(clone);
    cloneElement.current = clone;

    if (isDragging) {
      document.addEventListener("mousemove", callback);
      document.addEventListener("mouseup", handleMouseUp);
    }
  };

  const handleDragStart: HandleDragStart = useCallback(
    (container, index, taskId) => {
      dragItem.current = { container, index };
      dragtoIndex.current = index;
      dragtoContainer.current = container;
      savedTaskId.current = taskId;

      setToContainer(container);
      setNextIndex(index);
      setDragging(true);
    },
    []
  );

  const handleDragOver: HandleDragOver = useCallback(
    (container, index) => {
      dragtoContainer.current = container;
      dragtoIndex.current = index;

      if (
        (dragItem.current.container === container &&
          dragItem.current.index === index) ||
        projectId === null
      ) {
        return;
      }

      dispatch({
        type: "MOVE_TASK",
        payload: {
          projectId,
          taskId: savedTaskId.current,
          fromContainer: dragItem.current?.container,
          toContainer: dragtoContainer.current,
          fromIndex: dragItem.current?.index,
          toIndex: dragtoIndex.current,
        },
      });
      dragItem.current = { container, index };
    },
    [projectId]
  );

  const handleDrag: HandleDrag = (e, ref, container) => {
    if (!isDragging.current) {
      return;
    }

    const target = ref.current || (e.target as HTMLElement);
    const scrollContainer = target.querySelector("ul");
    const draggableElements = target.querySelectorAll("[role=taskItem]");

    const mappedPositions = [...draggableElements]
      .filter((_, index) => {
        if (container === dragItem.current?.container) {
          return index !== dragItem.current?.index;
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
    handleDragOver(container, getIndex);
  };

  const handleDragEnd = () => {
    if (!isDragging.current) {
      return;
    }

    savedTaskId.current = "";
    isDragging.current = false;
    dragItemNode.current = null;
    setNextIndex(null);
    setDragging(false);

    document.removeEventListener("mousemove", callback);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return {
    handleDrag,
    handleDragStart,
    handleMouseDown,
    dragging,
    toContainer,
    nextIndex,
    dragItem,
  };
};
