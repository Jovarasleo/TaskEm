import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TasksContainer from "./TasksContainer";

afterEach(() => {
  cleanup(); // Resets the DOM after each test suite
});

const tasks = [
  {
    name: "test1",
    description: "description1",
  },
  {
    name: "test2",
    description: "description2",
  },
  {
    name: "test3",
    description: "description3",
  },
];

describe("Test if task container renders and it's functionallity", () => {
  test("task container renders", () => {
    render(<TasksContainer dataTestId={"tasksContainer"} tasks={tasks} />);
    const taskContainer = screen.getByTestId("tasksContainer");
    expect(taskContainer).toBeInTheDocument();
  });

  test("taskManager takes tasksObject key as a container type and creates task for every item in array of that keys value", async () => {
    render(<TasksContainer tasks={tasks} />);
    const getAllTasks = await screen.findAllByRole("taskItem");
    expect(getAllTasks.length).toBe(tasks.length);
    tasks.forEach((task) => {
      screen.getAllByText(task.name);
      screen.getAllByText(task.description);
    });
  });
});
