import { cleanup } from "@testing-library/react";
import { DragEvent } from "react";
import autoScroll from "../autoScroll";
import "@testing-library/jest-dom";

afterEach(() => {
  cleanup();
});

describe("autoScroll", () => {
  let scrollContainer: HTMLUListElement | null;

  beforeEach(() => {
    scrollContainer = document.createElement("ul");
    scrollContainer.style.height = "100px";
    scrollContainer.style.overflow = "auto";
    for (let i = 0; i < 10; i++) {
      const li = document.createElement("li");
      li.innerText = `Item ${i}`;
      scrollContainer.appendChild(li);
    }
    document.body.appendChild(scrollContainer);
  });

  afterEach(() => {
    if (scrollContainer) {
      document.body.removeChild(scrollContainer);
    }
  });

  test("should not scroll if the mouse is not close to the top or bottom of the container", () => {
    const e = {
      clientY: 50,
    } as DragEvent<HTMLElement>;

    const initialScrollTop = scrollContainer?.scrollTop;
    autoScroll(scrollContainer, false, e);
    const finalScrollTop = scrollContainer?.scrollTop;
    expect(finalScrollTop).toBe(initialScrollTop);
  });

  test("should scroll up when the mouse is close to the top of the container", () => {
    const e = {
      clientY: 10,
    } as DragEvent<HTMLElement>;

    const initialScrollTop = scrollContainer?.scrollTop;
    autoScroll(scrollContainer, false, e);
    const finalScrollTop = scrollContainer?.scrollTop;
    expect(finalScrollTop).toBeLessThanOrEqual(initialScrollTop || 0);
  });

  test("should scroll down when the mouse is close to the bottom of the container", () => {
    const e = {
      clientY: 90,
    } as DragEvent<HTMLElement>;

    const initialScrollTop = scrollContainer?.scrollTop;
    autoScroll(scrollContainer, false, e);
    const finalScrollTop = scrollContainer?.scrollTop;
    expect(finalScrollTop).toBeGreaterThanOrEqual(initialScrollTop || 0);
  });
});
