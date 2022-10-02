import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Test from "./Test";

afterEach(() => {
  cleanup(); // Resets the DOM after each test suite
});

describe("renders ahref element and hover it", () => {
  render(
    <Test page="http://www.facebook.com" dataTestId="linkItem">
      <div>Facebook</div>
    </Test>
  );
  const linkItem = screen.getByTestId("linkItem");
  test("Button Rendering", () => {
    expect(linkItem).toBeInTheDocument();
    fireEvent.mouseEnter(linkItem);
    expect(linkItem).toHaveClass("hovered");
    fireEvent.mouseLeave(linkItem);
    expect(linkItem).toHaveClass("normal");
  });
});

// describe("link item", () => {
//   test("Button Rendering", () => {
//     render(
//       <Test page="http://www.facebook.com">
//         <div>Facebook</div>
//       </Test>
//     );
//     const button = screen.getByText("Facebook");
//     expect(button).toBeInTheDocument();
//     expect(button).toBeTruthy();
//   });
// });
