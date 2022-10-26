import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TasksContainer from "./TasksContainer";

afterEach(() => {
  cleanup(); // Resets the DOM after each test suite
});

const testArray = [
  {
    id: "1",
    name: "test1",
    description: "description1",
  },
  {
    id: "2",
    name: "test2",
    description: "description2",
  },
  {
    id: "3",
    name: "test3",
    description: "description3",
  },
];
const saveTask = () => {};
describe("Test if task container renders and it's functionallity", () => {
  test("task container renders", () => {
    render(
      <TasksContainer
        dataTestId={"tasksContainer"}
        todo
        saveTask={saveTask}
        tasks={testArray}
        container={"todo"}
        dragging
        selectedContainer="todo"
        handleDragStart={() => {}}
        handleDragOver={() => {}}
      />
    );
    const taskContainer = screen.getByTestId("tasksContainer");
    expect(taskContainer).toBeInTheDocument();
  });

  test("taskManager takes tasksObject key as a container type and creates task for every item in array of that keys value", async () => {
    render(
      <TasksContainer
        dataTestId={"tasksContainer"}
        todo
        saveTask={saveTask}
        tasks={testArray}
        container={"todo"}
        dragging
        selectedContainer="todo"
        handleDragStart={() => {}}
        handleDragOver={() => {}}
      />
    );
    const getAllTasks = await screen.findAllByRole("taskItem");
    expect(getAllTasks.length).toBe(testArray.length);
    testArray.forEach((task) => {
      screen.getAllByText(task.name);
      screen.getAllByText(task.description);
    });
  });
});
