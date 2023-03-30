import {
  DragItem,
  HandleDrag,
  HandleDragOver,
  HandleDragStart,
  HandleDragLeave,
} from "../model/task";
import { useRef, useState, useCallback } from "react";
import autoScroll from "../util/autoScroll";
import { Actions } from "../model/task";

export const useDragAndDrop = (
  dispatch: (action: Actions) => void,
  projectId: string
) => {
  const [dragging, setDragging] = useState(false);
  const [toContainer, setToContainer] = useState("");
  const [nextIndex, setNextIndex] = useState<null | number>(0);
  const allowTransfer = useRef(true);

  const savedTaskId = useRef("");
  const dragItem = useRef<DragItem | null>({ container: "", index: 0 });
  const dragItemNode = useRef<HTMLElement | null>(null);
  const dragtoIndex = useRef(0);
  const dragtoContainer = useRef("");
  const isDragging = useRef(false);

  const position = useRef({ left: 0, top: 0 });
  const cloneElement = useRef<HTMLElement | null>();

  const handleAllowTransfer = () => {
    allowTransfer.current = true;
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
  const callback = (e: any) => handleMouseMove(e);

  const handleMouseDown = (e: any, taskItem, container, index, taskId) => {
    e.preventDefault();
    e.stopPropagation();

    dragItemNode.current = taskItem.current as HTMLElement;
    isDragging.current = true;
    handleDragStart(taskItem, container, index, taskId);

    const { left, top } = taskItem.current.getBoundingClientRect();
    const offsetX = left - e.clientX;
    const offsetY = top - e.clientY;
    position.current = { top: offsetY, left: offsetX };

    const clone = dragItemNode?.current.cloneNode(true) as HTMLElement;
    document.body.appendChild(clone);
    clone.style.position = "absolute";
    clone.style.width = `${taskItem.current.offsetWidth}px`;
    clone.style.left = `${left}px`;
    clone.style.top = `${top}px`;
    clone.style.boxShadow = `0px 0px 6px 2px rgb(84, 84, 84)`;
    document.body.style.cursor = "grabbing";
    clone.style.pointerEvents = "none";
    cloneElement.current = clone;

    if (isDragging) {
      document.addEventListener("mousemove", callback);
      document.addEventListener("mouseup", handleMouseUp);
    }
  };

  const handleDragStart: HandleDragStart = useCallback(
    (taskItem, container, index, taskId) => {
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

  const handleDragOver: HandleDragOver = useCallback((e, container, index) => {
    dragtoContainer.current = container;
    dragtoIndex.current = index;

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

    dragItemNode.current = document.querySelectorAll(`[role=${container}] ul li`)[
      index
    ];

    // if (dragItemNode.current) {
    //   dragItemNode.current.style.background = "gray";
    //   dragItemNode.current.childNodes.forEach((child) => {
    //     child.style.visibility = "hidden";
    //   });
    // }
    // console.log(dragItemNode.current);
    dragItem.current = { container, index };
  }, []);

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

    const pointerPosition = [...draggableElements].map((element) => {
      const rect = element.getBoundingClientRect();
      const position = Math.round(e.clientY - rect.top - rect.height / 2);
      return position;
    });

    const pointerIndex = pointerPosition.reduce((acc, item, index) => {
      if (item > 0) {
        return index + 1;
      }
      return acc;
    }, 0);

    const scrollToBottom = draggableElements.length === pointerIndex;

    setToContainer(container);
    setNextIndex(getIndex);
    autoScroll(scrollContainer, scrollToBottom, e);
    handleDragOver(e, container, getIndex);
  };

  const handleDragLeave: HandleDragLeave = useCallback(() => {
    if (!isDragging.current) {
      return;
    }

    const { container, index } = dragItem?.current as DragItem;
    dragtoContainer.current = container;
    dragtoIndex.current = index;

    setNextIndex(null);
    setToContainer("");
  }, []);

  const handleDragEnd = () => {
    if (!isDragging.current) {
      return;
    }

    // dispatch({
    //   type: "MOVE_TASK",
    //   payload: {
    //     projectId,
    //     taskId: savedTaskId.current,
    //     fromContainer: dragItem.current?.container,
    //     toContainer: dragtoContainer.current,
    //     fromIndex: dragItem.current?.index,
    //     toIndex: dragtoIndex.current,
    //   },
    // });

    savedTaskId.current = "";
    dragItem.current = null;
    isDragging.current = false;
    dragItemNode.current = null;
    setNextIndex(null);
    setDragging(false);

    document.removeEventListener("mousemove", callback);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return {
    handleDrag,
    handleDragOver,
    handleDragStart,
    handleDragLeave,
    handleDragEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleAllowTransfer,
    dragging,
    toContainer,
    nextIndex,
    dragItem,
    dragItemNode,
    dragtoIndex,
    dragtoContainer,
  };
};
