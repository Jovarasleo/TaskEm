import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Header from "../components/header/Header";
import { TaskProvider } from "../context/taskContext";

afterEach(() => {
  cleanup();
});

describe("Header component renders", () => {
  test("nav button renders and works as intended", async () => {
    render(
      <TaskProvider>
        <Header />
      </TaskProvider>
    );

    //header renders
    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();

    //navigation has not rendered yet
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();

    //button to open nav is rendered and clicked
    const openNavButton = screen.getByRole("button");
    expect(openNavButton).toBeInTheDocument();
    fireEvent.click(openNavButton);

    //nav opens
    const navigation = screen.getByRole("navigation");
    expect(navigation).toBeInTheDocument();

    //nav closes
    //onClick changes state of a transition, when it ends component unmounts.
    const closeNavButton = screen.getAllByRole("button")[0];
    fireEvent.click(closeNavButton);
    fireEvent.transitionEnd(navigation);

    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });
});
