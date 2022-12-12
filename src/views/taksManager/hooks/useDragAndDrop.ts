import {
  DragItem,
  handleDrag,
  handleDragOver,
  handleDragStart,
} from "../model/task";
import { useRef, useState, DragEvent, Dispatch } from "react";

type Action = {
  type: "MOVE_TASK";
  fromContainer: string | undefined;
  toContainer: string;
  fromIndex: number | undefined;
  toIndex: number;
};

export const useDragAndDrop = (dispatch: Dispatch<Action>) => {
  const [dragging, setDragging] = useState(false);
  const [toContainer, setToContainer] = useState("");
  const [nextIndex, setNextIndex] = useState<null | number>(0);

  const dragItem = useRef<DragItem | null>(null);
  const dragItemNode = useRef<HTMLElement | null>(null);
  const dragtoIndex = useRef(0);
  const dragtoContainer = useRef("");

  const handleDragStart: handleDragStart = (
    e: DragEvent<HTMLElement>,
    container,
    index
  ) => {
    dragItemNode.current = e.target as HTMLElement;
    dragItem.current = { container, index };
    dragtoContainer.current = container;

    setTimeout(() => {
      setDragging(true);
    }, 0);
  };

  const handleDragOver: handleDragOver = (e, container, index) => {
    e.stopPropagation();
    setToContainer(container);
    dragtoContainer.current = container;
    dragtoIndex.current = index;
    dragItemNode?.current?.addEventListener("dragend", handleDragEnd);
  };

  const handleDragEnd = () => {
    setNextIndex(null);
    setDragging(false);
    dragItemNode?.current?.removeEventListener("dragend", handleDragEnd);
    dispatch({
      type: "MOVE_TASK",
      fromContainer: dragItem.current?.container,
      toContainer: dragtoContainer.current,
      fromIndex: dragItem.current?.index,
      toIndex: dragtoIndex.current,
    });
    dragItem.current = null;
    dragItemNode.current = null;
  };
  const handleDrag: handleDrag = (e, ref, container) => {
    e.preventDefault();
    e.stopPropagation();

    const target = ref.current || (e.target as HTMLElement);
    const draggableElements = target.querySelectorAll("[draggable]");

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

    setNextIndex(pointerIndex);
    handleDragOver(e, container, getIndex);
  };

  return {
    handleDragStart,
    handleDragOver,
    handleDrag,
    dragging,
    toContainer,
    nextIndex,
    dragItem,
  };
};
