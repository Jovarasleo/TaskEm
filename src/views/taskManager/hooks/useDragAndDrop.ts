import { useRef, useState, RefObject } from "react";
interface DragItem {
  container: string;
  index: number;
}

export const useDragAndDrop = (
  callback: (
    fromContainer: string | undefined,
    toContainer: string,
    fromIndex: number | undefined,
    toIndex: number
  ) => void
) => {
  const [dragging, setDragging] = useState(false);
  const dragItem = useRef<DragItem | null>(null);
  const dragItemNode = useRef<HTMLDivElement | null>(null);
  const dragtoIndex = useRef(0);
  const dragtoContainer = useRef("todo");
  const cursorStartPosition = useRef(0);

  const handleDragStart = (e: any, container: string, index: number) => {
    dragItemNode.current = e.target;
    dragItem.current = { container, index };
    cursorStartPosition.current = e.clientY;
    setDragging((prevValue) => (prevValue = true));
  };

  const handleDragOver = (e: any, container: string, index: number) => {
    e.stopPropagation();
    e.preventDefault();
    dragtoContainer.current = container;
    dragtoIndex.current = index;
    dragItemNode?.current?.addEventListener("dragend", handleDragEnd);
  };

  const handleDragEnd = () => {
    setDragging((prevValue) => (prevValue = false));
    dragItemNode?.current?.removeEventListener("dragend", handleDragEnd);
    callback(
      dragItem.current?.container,
      dragtoContainer.current,
      dragItem.current?.index,
      dragtoIndex.current
    );
    dragItem.current = null;
    dragItemNode.current = null;
  };
  const handleDrag = (
    e: React.DragEvent<HTMLElement>,
    ref: RefObject<HTMLDivElement>,
    container: string
  ) => {
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
        var rect = element.getBoundingClientRect();
        const position = Math.round(e.clientY - rect.top - rect.height / 2);
        return position;
      });

    const getIndex = mappedPositions.reduce((acc, item, index) => {
      if (item > 0) {
        return (acc = index + 1);
      }
      return acc;
    }, 0);

    handleDragOver(e, container, getIndex);
  };
  return {
    handleDragStart,
    handleDragOver,
    handleDrag,
    dragging,
    dragItem,
  };
};
