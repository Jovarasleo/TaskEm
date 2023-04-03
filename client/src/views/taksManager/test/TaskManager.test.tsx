import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TaskManager from "../TaskManager";
import { TaskProvider } from "../../../context/taskContext";

afterEach(() => {
  cleanup(); // Resets the DOM after each test suite
});

const taskText = "testing text";

describe("Test if taskManager renders and it's functionality works", () => {
  test("clicking add button creates new task and delete button deletes task", () => {
    render(
      <TaskProvider>
        <TaskManager />
      </TaskProvider>
    );
    //check if project exists
    const selectText = screen.getByText("No projects yet!");
    if (selectText) {
      return;
    }
    //task creation
    const tasksCountBeforeAdding = screen.queryAllByRole("taskItem").length;
    const createTaskButton = screen.getByRole("create_task");
    fireEvent.click(createTaskButton);
    const textbox = screen.getByRole("textbox");
    fireEvent.change(textbox, { target: { value: taskText } });
    expect(textbox.textContent).toBe(taskText);

    fireEvent.keyDown(textbox, {
      key: "Enter",
    });

    expect(screen.getByText(taskText));

    const tasksCountAfterAdding = screen.getAllByRole("taskItem").length;
    expect(tasksCountBeforeAdding).not.toBe(tasksCountAfterAdding);

    //Task Deletion
    const deleteTaskButton = screen.getByRole("delete_task");
    fireEvent.click(deleteTaskButton);
    const tasksCountAfterDeletion = screen.queryAllByRole("taskItem").length;
    expect(tasksCountBeforeAdding).toBe(tasksCountAfterDeletion);
  });
});
