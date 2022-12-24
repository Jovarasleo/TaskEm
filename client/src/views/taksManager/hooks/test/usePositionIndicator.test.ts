import { cleanup, renderHook } from "@testing-library/react";
import usePositionIndicator from "../usePositionIndicator";
import "@testing-library/jest-dom";

afterEach(() => {
  cleanup();
});

describe("Test position indicator", () => {
  test("insert task before", () => {
    const { result } = renderHook(() =>
      usePositionIndicator("todo", "todo", 0, 0, 0)
    );
    expect(result.current).toBe("before");
  });

  test("insert task after", () => {
    const { result } = renderHook(() =>
      usePositionIndicator("todo", "todo", 2, 1, 1)
    );
    expect(result.current).toBe("after");
  });

  test("return empty", () => {
    const { result } = renderHook(() =>
      usePositionIndicator("todo", "done", 2, 1, 1)
    );
    expect(result.current).toBe("");
  });
});
