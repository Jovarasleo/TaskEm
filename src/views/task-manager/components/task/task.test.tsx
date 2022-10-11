import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Task from "./task";

afterEach(() => {
  cleanup(); // Resets the DOM after each test suite
});

const inputValue = "Hello, this is test value";

describe("Test if task container renders and it's functionality works", () => {
  test("task container renders", () => {
    render(<Task dataTestId="Task" />);
    const taskContainer = screen.getByTestId("Task");
    expect(taskContainer).toBeInTheDocument();
  });

  test("Testing interactions with task container buttons and input fields", () => {
    render(<Task dataTestId="Task" />);
    const taskButton = screen.getByRole("button");
    fireEvent.click(taskButton);
    const taskItem = screen.getByRole("textbox");
    expect(taskItem).toBeInTheDocument();
    expect(taskItem).toBe(document.activeElement);
    fireEvent.click(taskItem);
    expect(taskItem).toBeInTheDocument();
    fireEvent.keyDown(taskItem, {
      key: "Enter",
    });
    expect(taskItem).not.toBeInTheDocument();
  });

  test("Testing writing inside fields", () => {
    render(<Task dataTestId="Task" />);
    const taskButton = screen.getByRole("button");
    fireEvent.click(taskButton);
    const taskItem = screen.getByRole("textbox");
    fireEvent.change(taskItem, { target: { value: inputValue } });
    expect(taskItem.textContent).toBe(inputValue);
    fireEvent.keyDown(taskItem, {
      key: "Enter",
    });
    expect(screen.getByRole("button").textContent).toBe(inputValue);
  });
});
