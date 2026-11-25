import { expect, test } from "@playwright/test";

test("discovery page lists the concepts", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("poking at them");
  await expect(page.getByRole("link", { name: /satellites fall down/ })).toBeVisible();
});
