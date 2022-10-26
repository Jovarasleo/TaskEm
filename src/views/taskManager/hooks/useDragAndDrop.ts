import { useRef, useState } from "react";
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
  const dragtoContainer = useRef("done");

  const handleDragStart = (e: any, task: any) => {
    dragItemNode.current = e.target;
    dragItem.current = task;
    setDragging((prevValue) => (prevValue = true));
  };

  const handleDragOver = (e: any, targetItem: any) => {
    e.stopPropagation();
    e.preventDefault();
    dragtoIndex.current = targetItem.index;
    dragtoContainer.current = targetItem.container;
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
  return { handleDragStart, handleDragOver, dragging, dragItem };
};
