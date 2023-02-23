import { test, expect } from "@playwright/test";

test("drag-and-drop test", async ({ page }) => {
  await page.goto("http://localhost:8080/");
  await page.locator("button.menuButton ").click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("test");
  await page.getByRole("button", { name: "Create Project" }).click();
  await page.getByRole("button", { name: "test" }).click();
  await page.locator("button.menuButton ").click();

  await page.getByRole("button", { name: "+" }).click();
  await page.locator("textarea.input").click();
  await page.locator("textarea.input").fill("test drag and drop");
  await page.locator("textarea.input").press("Enter");

  await page.dragAndDrop(
    "div >> text=test drag and drop",
    "section >> text=progress",
    {
      force: true,
    }
  );

  const containers = page.locator("section");
  const array = await containers.allTextContents();
  expect(array[1]).toContain("test drag and drop");
});
