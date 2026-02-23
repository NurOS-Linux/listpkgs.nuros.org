import { test, expect } from '@playwright/test';

test('should load home page', async ({ page }) => {
  await page.goto('/');
  // Check if search bar is visible
  const searchInput = page.locator('.search-input');
  await expect(searchInput).toBeVisible();
});

test('should display search bar', async ({ page }) => {
  await page.goto('/');
  const searchInput = page.locator('.search-input');
  const searchBtn = page.locator('.search-button');
  await expect(searchInput).toBeVisible();
  await expect(searchBtn).toBeVisible();
});

test('should display packages list', async ({ page }) => {
  await page.goto('/');
  // Wait for packages to load
  await page.waitForLoadState('networkidle');
  const packageCards = page.locator('.package-card');
  await expect(packageCards.first()).toBeVisible();
});

test('should toggle between list and grouped view', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Find and click grouped view button
  const groupedViewBtn = page.locator('button', { hasText: 'Grouped View' });
  await expect(groupedViewBtn).toBeVisible();
  await groupedViewBtn.click();
  await page.waitForTimeout(300);

  // Find and click list view button
  const listViewBtn = page.locator('button', { hasText: 'List View' });
  await expect(listViewBtn).toBeVisible();
  await listViewBtn.click();
  await page.waitForTimeout(300);
});

test('should search packages', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const searchInput = page.locator('.search-input');
  const searchBtn = page.locator('.search-button');

  await searchInput.fill('git');
  await searchBtn.click();
  await page.waitForTimeout(300);

  // Verify package cards are still visible
  const packageCards = page.locator('.package-card');
  await expect(packageCards.first()).toBeVisible();
});

test('should display package json on dark theme', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Enable dark theme
  const themeToggle = page.locator('.theme-toggle-btn');
  if (await themeToggle.isVisible()) {
    await themeToggle.click();
    await page.waitForTimeout(600); // Wait for theme transition
  }

  // Find package card and click toggle button
  const packageCard = page.locator('.package-card').first();
  const toggleBtn = packageCard.locator('.toggle-details-btn');

  if (await toggleBtn.isVisible()) {
    await toggleBtn.click();
    await page.waitForTimeout(300);

    // Check if json display is visible
    const jsonDisplay = page.locator('.json-display-prism');
    await expect(jsonDisplay).toBeVisible();
  }
});
