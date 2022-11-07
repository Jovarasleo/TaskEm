import {
  DragItem,
  MoveTask,
  handleDrag,
  handleDragOver,
  handleDragStart,
} from "../model/task";
import { useRef, useState } from "react";

export const useDragAndDrop = (moveTask: MoveTask) => {
  const [dragging, setDragging] = useState(false);
  const [toContainer, setToContainer] = useState("");
  const [nextPosition, setNextPosition] = useState<null | number>(0);

  const dragItem = useRef<DragItem | null>(null);
  const dragItemNode = useRef<HTMLDivElement | null>(null);
  const dragtoIndex = useRef(0);
  const dragtoContainer = useRef("");

  const handleDragStart: handleDragStart = (e: any, container, index) => {
    dragItemNode.current = e.target;
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
    setNextPosition(null);
    setDragging(false);
    dragItemNode?.current?.removeEventListener("dragend", handleDragEnd);
    moveTask(
      dragItem.current?.container,
      dragtoContainer.current,
      dragItem.current?.index,
      dragtoIndex.current
    );
    dragItem.current = null;
    dragItemNode.current = null;
  };
  const handleDrag: handleDrag = (e, ref, container) => {
    e.preventDefault();
    e.stopPropagation();

    const target = ref.current || (e.target as any);
    const draggableElements: HTMLElement[] =
      target.querySelectorAll("[draggable]");

    const mappedPositions = [...draggableElements]
      .filter((_, index) => {
        if (container === dragItem.current?.container) {
          return index !== dragItem.current?.index;
        } else {
          return index + 1;
        }
      })
      .map((element) => {
        let rect = element.getBoundingClientRect();
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
      let rect = element.getBoundingClientRect();
      const position = Math.round(e.clientY - rect.top - rect.height / 2);
      return position;
    });

    const pointerIndex = pointerPosition.reduce((acc, item, index) => {
      if (item > 0) {
        return index + 1;
      }
      return acc;
    }, 0);

    setNextPosition(pointerIndex);
    handleDragOver(e, container, getIndex);
  };

  return {
    handleDragStart,
    handleDragOver,
    handleDrag,
    dragging,
    toContainer,
    nextPosition,
    dragItem,
  };
};
