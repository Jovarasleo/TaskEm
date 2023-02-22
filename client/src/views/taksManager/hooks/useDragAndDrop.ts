import {
  DragItem,
  handleDrag,
  handleDragOver,
  handleDragStart,
  handleDragLeave,
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
    e.preventDefault();

    dragtoContainer.current = container;
    dragtoIndex.current = index;
    dragItemNode?.current?.addEventListener("dragend", handleDragEnd);

    setToContainer(container);
  };

  const handleDragLeave: handleDragLeave = (e) => {
    const { container, index } = dragItem.current as DragItem;
    dragtoContainer.current = container;
    dragtoIndex.current = index;

    setNextIndex(null);
    setToContainer("");
  };

  const handleDragEnd = () => {
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

    setNextIndex(null);
    setDragging(false);
  };

  const handleDrag: handleDrag = (e, ref, container) => {
    const target = ref.current || (e.target as HTMLElement);
    const draggableElements = target.querySelectorAll("[draggable]");
    const scroll = e.clientY - target.getBoundingClientRect().top;

    const clientYPosition = target.clientHeight / 2 - scroll;

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

    if (clientYPosition > 200 || clientYPosition < -200) {
      draggableElements[getIndex]?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "center",
      });
    }

    setNextIndex(pointerIndex);
    handleDragOver(e, container, getIndex);
  };

  return {
    handleDrag,
    handleDragStart,
    handleDragLeave,
    dragging,
    toContainer,
    nextIndex,
    dragItem,
  };
};
