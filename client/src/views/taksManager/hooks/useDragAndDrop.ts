import {
  DragItem,
  HandleDrag,
  HandleDragOver,
  HandleDragStart,
  HandleDragLeave,
} from "../model/task";
import { useRef, useState, DragEvent, useCallback } from "react";
import autoScroll from "../util/autoScroll";
import { Actions } from "../model/task";

export const useDragAndDrop = (
  dispatch: (action: Actions) => void,
  projectId: string
) => {
  const [dragging, setDragging] = useState(false);
  const [toContainer, setToContainer] = useState("");
  const [nextIndex, setNextIndex] = useState<null | number>(0);

  const savedTaskId = useRef("");
  const dragItem = useRef<DragItem | null>({ container: "", index: 0 });
  const dragItemNode = useRef<HTMLElement | null>(null);
  const dragtoIndex = useRef(0);
  const dragtoContainer = useRef("");
  const isDragging = useRef(false);

  const handleDragStart: HandleDragStart = useCallback(
    (e, container, index, taskId) => {
      dragItemNode.current = e.target as HTMLElement;
      dragItem.current = { container, index };
      dragtoContainer.current = container;
      savedTaskId.current = taskId;
      isDragging.current = true;

      setDragging(true);
    },
    []
  );

  const handleDragOver: HandleDragOver = useCallback((e, container, index) => {
    e.preventDefault();

    dragtoContainer.current = container;
    dragtoIndex.current = index;

    setToContainer(container);
  }, []);

  const handleDrag: HandleDrag = (e, ref, container) => {
    e.preventDefault();
    const target = ref.current || (e.target as HTMLElement);
    const scrollContainer = target.querySelector("ul");
    const draggableElements = scrollContainer?.children || [];

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

    setNextIndex(pointerIndex);
    autoScroll(scrollContainer, scrollToBottom, e);
    handleDragOver(e, container, getIndex);
  };

  const handleDragLeave: HandleDragLeave = useCallback(() => {
    const { container, index } = dragItem?.current as DragItem;
    dragtoContainer.current = container;
    dragtoIndex.current = index;

    setNextIndex(null);
    setToContainer("");
  }, []);

  const handleDragEnd = () => {
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
    dragItem.current = null;
    dragItemNode.current = null;

    setNextIndex(null);
    // isDragging.current = false;

    // if (!isDragging.current) {
    setDragging(false);
    // }
  };

  return {
    handleDrag,
    handleDragOver,
    handleDragStart,
    handleDragLeave,
    handleDragEnd,
    dragging,
    toContainer,
    nextIndex,
    dragItem,
    dragItemNode,
    dragtoIndex,
    dragtoContainer,
  };
};
