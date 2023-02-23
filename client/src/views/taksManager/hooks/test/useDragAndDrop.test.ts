import { cleanup, renderHook, act } from "@testing-library/react";
import { useDragAndDrop } from "../useDragAndDrop";

describe("useDragAndDrop", () => {
  test("it should handle drag start", () => {
    const dispatch = jest.fn();
    const { result } = renderHook(() => useDragAndDrop(dispatch));
    const dragEvent = { target: {} } as React.DragEvent<HTMLElement>;

    act(() => {
      result.current.handleDragStart(dragEvent, "container1", 0);
    });

    // expect(result.current.dragging).toBe(true);
    expect(result.current.toContainer).toBe("");
    expect(result.current.nextIndex).toBe(0);
    expect(result.current.dragItem.current).toMatchObject({
      container: "container1",
      index: 0,
    });
    expect(result.current.dragItemNode.current).toBe(dragEvent.target);
    expect(result.current.dragtoIndex.current).toBe(0);
    expect(result.current.dragtoContainer.current).toBe("container1");
  });

  test("it should handle drag over", () => {
    const dispatch = jest.fn();
    const { result } = renderHook(() => useDragAndDrop(dispatch));
    const dragEvent = {
      preventDefault: () => {},
    } as unknown as React.DragEvent<HTMLElement>;

    act(() => {
      result.current.handleDragOver(dragEvent, "container2", 1);
    });

    expect(result.current.toContainer).toBe("container2");
    expect(result.current.dragtoIndex.current).toBe(1);
  });

  test("it should handle drag leave", () => {
    const dispatch = jest.fn();
    const { result } = renderHook(() => useDragAndDrop(dispatch));

    act(() => {
      result.current.handleDragLeave();
    });

    expect(result.current.toContainer).toBe("");
    expect(result.current.nextIndex).toBe(null);
    expect(result.current.dragtoContainer.current).toBe("");
    expect(result.current.dragtoIndex.current).toBe(0);
  });

  test("it should handle drag end", () => {
    const dispatch = jest.fn();
    const { result } = renderHook(() => useDragAndDrop(dispatch));
    result.current.dragItem.current = { container: "container1", index: 0 };
    result.current.dragItemNode.current = document.createElement("div");

    act(() => {
      result.current.handleDragEnd();
    });

    expect(dispatch).toHaveBeenCalledWith({
      type: "MOVE_TASK",
      fromContainer: "container1",
      toContainer: "",
      fromIndex: 0,
      toIndex: 0,
    });

    expect(result.current.dragItem.current).toBe(null);
    expect(result.current.dragItemNode.current).toBe(null);
    expect(result.current.dragging).toBe(false);
    expect(result.current.toContainer).toBe("");
    expect(result.current.nextIndex).toBe(null);
    expect(result.current.dragtoIndex.current).toBe(0);
    expect(result.current.dragtoContainer.current).toBe("");
  });

  test("it should handle drag", () => {
    const dispatch = jest.fn();
    const { result } = renderHook(() => useDragAndDrop(dispatch));
    const ref = { current: document.createElement("div") };
    const container = "container1";

    const dragEvent = {
      preventDefault: () => {},
      clientY: 100,
    } as unknown as React.DragEvent<HTMLElement>;

    act(() => {
      result.current.handleDrag(dragEvent, ref, container);
    });

    expect(result.current.nextIndex).toBe(0);
    expect(result.current.toContainer).toBe(container);
    expect(result.current.dragtoIndex.current).toBe(0);
  });
});
