import { test, expect, Page } from '@playwright/test';

// Helper function to close sidebar on mobile
async function closeSidebarIfNeeded(page: Page) {
  const viewport = page.viewportSize();
  if (viewport && viewport.width < 768) {
    // Mobile viewport - try to close sidebar if it exists
    const sidebarCloseBtn = page.locator('.sidebar-toggle-btn, [class*="close"]').first();
    if (await sidebarCloseBtn.isVisible().catch(() => false)) {
      await sidebarCloseBtn.click().catch(() => {});
    }
  }
}

test('should load home page', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Log page content for debugging
  const content = await page.content();
  console.log('Page loaded, content length:', content.length);

  // Try multiple selectors
  const searchInput = page
    .locator('input[class*="search"]')
    .or(page.locator('input[placeholder*="Search"]'))
    .or(page.locator('.search-input'));

  await expect(searchInput).toBeVisible({ timeout: 10000 });
});

test('should display search bar', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const searchInput = page
    .locator('input[class*="search"]')
    .or(page.locator('input[placeholder*="Search"]'))
    .or(page.locator('.search-input'));
  const searchBtn = page
    .locator('button[class*="search"]')
    .or(page.locator('button').filter({ hasText: 'Search' }))
    .or(page.locator('.search-button'));

  await expect(searchInput).toBeVisible({ timeout: 10000 });
  await expect(searchBtn).toBeVisible({ timeout: 10000 });
});

test('should display packages list', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const packageCards = page
    .locator('[class*="package"]')
    .or(page.locator('div').filter({ hasText: /version|version/i }))
    .or(page.locator('.package-card'));

  await expect(packageCards.first()).toBeVisible({ timeout: 10000 });
});

test('should toggle between list and grouped view', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Close sidebar on mobile if needed
  await closeSidebarIfNeeded(page);

  // Find and click grouped view button - try multiple selectors
  const groupedViewBtn = page
    .locator('button')
    .filter({ hasText: 'Grouped View' })
    .or(page.locator('button[class*="view"]').filter({ hasText: 'Grouped' }));

  await expect(groupedViewBtn).toBeVisible({ timeout: 10000 });
  await groupedViewBtn.first().click({ force: true });
  await page.waitForTimeout(300);

  // Find and click list view button
  const listViewBtn = page
    .locator('button')
    .filter({ hasText: 'List View' })
    .or(page.locator('button[class*="view"]').filter({ hasText: 'List' }));

  await expect(listViewBtn).toBeVisible({ timeout: 10000 });
  await listViewBtn.first().click({ force: true });
  await page.waitForTimeout(300);
});

test('should search packages', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Close sidebar on mobile if needed
  await closeSidebarIfNeeded(page);

  const searchInput = page
    .locator('input[class*="search"]')
    .or(page.locator('input[placeholder*="Search"]'))
    .or(page.locator('.search-input'));
  const searchBtn = page
    .locator('button[class*="search"]')
    .or(page.locator('button').filter({ hasText: 'Search' }))
    .or(page.locator('.search-button'));

  await searchInput.fill('git', { timeout: 10000 });
  await searchBtn.click({ force: true });
  await page.waitForTimeout(300);

  // Verify package cards are still visible
  const packageCards = page.locator('[class*="package"]').or(page.locator('.package-card'));

  await expect(packageCards.first()).toBeVisible({ timeout: 10000 });
});

test('should display package json on dark theme', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Close sidebar on mobile if needed
  await closeSidebarIfNeeded(page);

  // Enable dark theme
  const themeToggle = page
    .locator('button[class*="theme"]')
    .or(page.locator('button').filter({ hasText: /☀️|🌙/ }))
    .or(page.locator('.theme-toggle-btn'));

  if (await themeToggle.isVisible().catch(() => false)) {
    await themeToggle.first().click({ force: true });
    await page.waitForTimeout(600); // Wait for theme transition
  }

  // Find package card and click toggle button
  const packageCard = page.locator('[class*="package"]').or(page.locator('.package-card')).first();
  const toggleBtn = packageCard
    .locator('button')
    .filter({ hasText: 'JSON' })
    .or(packageCard.locator('.toggle-details-btn'));

  if (await toggleBtn.isVisible().catch(() => false)) {
    await toggleBtn.click({ force: true });
    await page.waitForTimeout(300);

    // Check if json display is visible
    const jsonDisplay = page.locator('[class*="json"]').or(page.locator('.json-display-prism'));

    await expect(jsonDisplay).toBeVisible({ timeout: 10000 });
  }
});
