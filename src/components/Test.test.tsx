import { render, screen, cleanup } from "@testing-library/react";
// Importing the jest testing library
import "@testing-library/jest-dom";
import Test from "./Test";

afterEach(() => {
  cleanup(); // Resets the DOM after each test suite
});

describe("renders ahref element and hover it", () => {
  render(
    <Test page="http://www.facebook.com">
      <div>Facebook</div>
    </Test>
  );
  const button = screen.getByTestId("linkItem");
  test("Button Rendering", () => {
    expect(button).toBeInTheDocument();
  });
});
