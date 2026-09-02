import { test, expect } from "@playwright/test";

test.describe("Portfolio - Critical User Journey", () => {
  test("user can view the portfolio homepage with all main sections", async ({ page }) => {
    await page.goto("/");

    // Hero section should be visible with the name
    await expect(page.getByRole("heading", { name: /Juwain Haque/i })).toBeVisible();

    // Work section should be visible with projects
    const workSection = page.locator("#work");
    await expect(workSection).toBeVisible();
    await expect(workSection.getByText(/Selected Work/i)).toBeVisible();

    // Contact section should be visible with form fields
    const contactSection = page.locator("#contact");
    await expect(contactSection).toBeVisible();
    await expect(contactSection.getByLabel(/Name/i)).toBeVisible();
    await expect(contactSection.getByLabel(/Email/i)).toBeVisible();
    await expect(contactSection.getByLabel(/Message/i)).toBeVisible();
  });

  test("user can fill out and submit the contact form", async ({ page }) => {
    await page.goto("/");

    // Scroll to contact section
    const contactSection = page.locator("#contact");
    await contactSection.scrollIntoViewIfNeeded();

    // Fill out the form
    await contactSection.getByLabel(/Name/i).fill("Test User");
    await contactSection.getByLabel(/Email/i).fill("test@example.com");
    await contactSection.getByLabel(/Message/i).fill("Hello, I would like to get in touch!");

    // Submit the form
    await contactSection.getByRole("button", { name: /Send Message/i }).click();

    // Success message should appear
    await expect(page.getByText(/Message sent/i)).toBeVisible();
  });

  test("user can navigate to a project detail page", async ({ page }) => {
    await page.goto("/");

    // Click on the first project
    const workSection = page.locator("#work");
    await workSection.scrollIntoViewIfNeeded();

    const firstProjectLink = workSection.locator("article a").first();
    await firstProjectLink.click();

    // Should navigate to project page
    await expect(page).toHaveURL(/\/work\//);

    // Project title should be visible
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});