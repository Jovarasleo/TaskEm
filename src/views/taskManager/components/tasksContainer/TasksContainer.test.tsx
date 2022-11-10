import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TasksContainer from "./TasksContainer";

afterEach(() => {
  cleanup(); // Resets the DOM after each test suite
});

const testArray = [
  {
    id: "1",
    value: "value1",
  },
  {
    id: "2",
    name: "test2",
    value: "value2",
  },
  {
    id: "3",
    name: "test3",
    value: "value3",
  },
];

const taskText = "taskTextValue";

const dispatch = jest.fn();
describe("Test if task container renders and it's functionallity", () => {
  test("task container renders", () => {
    render(
      <TasksContainer
        tasks={testArray}
        dispatch={dispatch}
        container={"todo"}
        dragging
        toContainer={""}
        nextPosition={null}
        dragItem={null}
        handleDrag={() => {}}
        handleDragStart={() => {}}
        handleDragOver={() => {}}
      />
    );
    const taskContainer = screen.getByRole("todo");
    expect(taskContainer).toBeInTheDocument();
  });

  test("taskManager takes tasksObject key as a container type and creates task for every item in array of that keys value", async () => {
    render(
      <TasksContainer
        tasks={testArray}
        dispatch={dispatch}
        container={"todo"}
        dragging
        toContainer={""}
        nextPosition={null}
        dragItem={null}
        handleDrag={() => {}}
        handleDragStart={() => {}}
        handleDragOver={() => {}}
      />
    );
    const getAllTasks = await screen.findAllByRole("taskItem");
    expect(getAllTasks.length).toBe(testArray.length);
    testArray.forEach((task) => {
      screen.getAllByText(task.value);
    });
  });
});
