import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Task from "./task";

afterEach(() => {
  cleanup(); // Resets the DOM after each test suite
});

const taskNameInput = "This is task name";
const taskDescriptionInput = "This is task description";

describe("Test if task container renders and it's functionality works", () => {
  test("task container renders", () => {
    render(<Task dataTestId="Task" />);
    const taskContainer = screen.getByTestId("Task");
    expect(taskContainer).toBeInTheDocument();
  });

  test("Testing task name inputs", () => {
    render(<Task dataTestId="Task" />);
    const taskNameButton = screen.getAllByRole("button")[0];
    fireEvent.click(taskNameButton);
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

  test("Testing task description inputs", () => {
    render(<Task dataTestId="Task" />);
    const taskDescriptionButton = screen.getAllByRole("button")[1];
    fireEvent.click(taskDescriptionButton);
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

  test("Testing writing inside task fields", () => {
    //testing name field
    render(<Task dataTestId="Task" />);
    const taskNameButton = screen.getAllByRole("button")[0];
    fireEvent.click(taskNameButton);
    const taskNameTextBox = screen.getByRole("textbox");
    fireEvent.change(taskNameTextBox, { target: { value: taskNameInput } });
    expect(taskNameTextBox.textContent).toBe(taskNameInput);
    fireEvent.keyDown(taskNameTextBox, {
      key: "Enter",
    });
    expect(screen.getAllByRole("button")[0].textContent).toBe(taskNameInput);
    //testing description field
    const taskDescriptionButton = screen.getAllByRole("button")[1];
    fireEvent.click(taskDescriptionButton);
    const taskDescriptionTextBox = screen.getByRole("textbox");
    fireEvent.change(taskDescriptionTextBox, {
      target: { value: taskDescriptionInput },
    });
    expect(taskDescriptionTextBox.textContent).toBe(taskDescriptionInput);
    fireEvent.keyDown(taskDescriptionTextBox, {
      key: "Enter",
    });
    expect(screen.getAllByRole("button")[1].textContent).toBe(
      taskDescriptionInput
    );
  });
});
