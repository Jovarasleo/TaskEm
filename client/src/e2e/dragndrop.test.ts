import { test, expect } from "@playwright/test";

test("drag-and-drop test", async ({ page }) => {
  await page.goto("http://localhost:8080/");
  await page.locator("button.menuButton ").click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("test");
  await page.getByRole("button", { name: "Create Project" }).click();
  await page.getByRole("button", { name: "test" }).click();
  await page.locator("button.menuButton ").click();

  await page.locator("button.addTaskButton").click();
  await page.locator("textarea.input").click();
  await page.locator("textarea.input").fill("test drag and drop");
  await page.locator("textarea.input").press("Enter");

  // await page.dragAndDrop(
  //   "li >> text=test drag and drop",
  //   "section >> text=progress",
  //   {
  //     force: true,
  //   }
  // );

  const locatorToDrag = page.locator("li.taskWrapper");
  const locatorDragTarget = page.locator("section").getByText("progress");

  const toDragBox = await locatorToDrag.boundingBox();
  const dragTargetBox = await locatorDragTarget.boundingBox();

  await page.mouse.move(
    toDragBox!.x + toDragBox!.width / 2,
    toDragBox!.y + toDragBox!.height / 2
  );
  await page.mouse.down();

  await page.mouse.move(
    dragTargetBox!.x + dragTargetBox!.width / 2,
    dragTargetBox!.y + dragTargetBox!.height / 2
  );
  await page.mouse.up();

  const containers = await page
    .getByRole("list")
    .filter({ hasText: "# 1test drag and drop" })
    .textContent();

  expect(containers).toContain("test drag and drop");
});
