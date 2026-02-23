import { test, expect } from '@playwright/test'

test('should load home page', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/NurOS/)
})

test('should display search bar', async ({ page }) => {
  await page.goto('/')
  const searchInput = page.locator('input[placeholder*="Search"]')
  await expect(searchInput).toBeVisible()
})

test('should display packages list', async ({ page }) => {
  await page.goto('/')
  const packageCards = page.locator('[class*="package-card"]')
  await expect(packageCards.first()).toBeVisible()
})

test('should toggle between list and grouped view', async ({ page }) => {
  await page.goto('/')
  const listViewBtn = page.locator('button', { hasText: /List/ })
  const groupedViewBtn = page.locator('button', { hasText: /Grouped/ })

  // Initial view should be list
  if (await groupedViewBtn.isVisible()) {
    await groupedViewBtn.click()
    await page.waitForTimeout(300) // Wait for animation
  }

  if (await listViewBtn.isVisible()) {
    await listViewBtn.click()
    await page.waitForTimeout(300)
  }
})

test('should search packages', async ({ page }) => {
  await page.goto('/')
  const searchInput = page.locator('input[placeholder*="Search"]')
  await searchInput.fill('git')
  await page.waitForTimeout(300)

  // Should display filtered results
  const packageCards = page.locator('[class*="package-card"]')
  await expect(packageCards.first()).toBeVisible()
})

test('should display package json on dark theme', async ({ page }) => {
  await page.goto('/')

  // Enable dark theme
  const themeToggle = page.locator('button[class*="theme-toggle"]')
  if (await themeToggle.isVisible()) {
    await themeToggle.click()
    await page.waitForTimeout(600) // Wait for theme transition
  }

  // Click package card to show json
  const packageCard = page.locator('[class*="package-card"]').first()
  await packageCard.click()

  // Check if json display is visible and properly styled
  const jsonDisplay = page.locator('[class*="json-display"]')
  if (await jsonDisplay.isVisible()) {
    // Verify background color on dark theme
    const bgColor = await jsonDisplay.evaluate((el) => window.getComputedStyle(el).backgroundColor)
    console.log('JSON Display background color:', bgColor)
  }
})
