import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TaskManager from "./TaskManager";

afterEach(() => {
  cleanup(); // Resets the DOM after each test suite
});

describe("Test if taskManager renders and it's functionality works", () => {
  test("clicking add button creates new task", () => {
    render(<TaskManager />);
    const tasksCountBeforeAdding = screen.getAllByRole("taskItem").length;
    const getButton = screen.getByRole("newTask");
    fireEvent.click(getButton);
    const tasksCountAfterAdding = screen.getAllByRole("taskItem").length;
    expect(tasksCountBeforeAdding).not.toBe(tasksCountAfterAdding);
  });
});
