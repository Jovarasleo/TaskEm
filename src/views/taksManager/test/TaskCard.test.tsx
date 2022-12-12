import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TaskCard from "../components/taskCard/TaskCard";

afterEach(() => {
  cleanup(); // Resets the DOM after each test suite
});

const taskTextValue = "This is task name";
const defaultTask = { value: "test Value", id: "1" };
const dispatch = jest.fn();

describe("Test if task container renders and it's functionality works", () => {
  test("task container renders", () => {
    render(
      <TaskCard
        dataTestId="Task"
        task={defaultTask}
        index={0}
        container={"todo"}
        dispatch={dispatch}
        handleDragStart={() => {}}
        dragging
        nextIndex={0}
        arrayLength={1}
        toContainer=""
        dragItem={null}
      />
    );
    const taskContainer = screen.getByTestId("Task");
    expect(taskContainer).toBeInTheDocument();
  });

  test("Testing task text input", () => {
    render(
      <TaskCard
        dataTestId="Task"
        task={defaultTask}
        index={0}
        container={"todo"}
        dispatch={dispatch}
        handleDragStart={() => {}}
        dragging
        nextIndex={0}
        arrayLength={1}
        toContainer=""
        dragItem={null}
      />
    );
    const taskText = screen.getByRole("paragraph");
    fireEvent.click(taskText);
    const taskName = screen.getByRole("textbox");
    expect(taskName).toBeInTheDocument();
    expect(taskName).toBe(document.activeElement);
    fireEvent.click(taskName);
    expect(taskName).toBeInTheDocument();
    fireEvent.keyDown(taskName, {
      key: "Enter",
    });
    expect(taskName).not.toBeInTheDocument();
  });

  test("Testing writing inside task fields", () => {
    render(
      <TaskCard
        dataTestId="Task"
        task={defaultTask}
        index={0}
        container={"todo"}
        dispatch={dispatch}
        handleDragStart={() => {}}
        dragging
        nextIndex={0}
        arrayLength={1}
        toContainer=""
        dragItem={null}
      />
    );

    const taskText = screen.getByRole("paragraph");
    fireEvent.click(taskText);
    const taskName = screen.getByRole("textbox");

    fireEvent.change(taskName, { target: { value: taskTextValue } });
    expect(taskName.textContent).toBe(taskTextValue);
    fireEvent.keyDown(taskName, {
      key: "Enter",
    });

    expect(screen.getByRole("paragraph").textContent).toBe(taskTextValue);
  });
});
