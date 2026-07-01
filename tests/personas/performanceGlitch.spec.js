const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { InventoryPage } = require('../../pages/InventoryPage');

// performance_glitch_user simulates a slow backend:
//   - Login has an artificial ~5 second delay
//   - Some page interactions are also slower than normal
// Login eventually succeeds — assertions must use extended timeouts
// and MUST NOT assert that pages load instantly.
//
// DO NOT use this user in beforeEach hooks shared with other tests —
// it will add 5+ seconds to every single test in the suite.

const SLOW_TIMEOUT = 15_000;

test.describe('Persona: performance_glitch_user — slow responses', () => {
  test('TC_PERF_001 - login eventually succeeds within acceptable time', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    const start = Date.now();
    await loginPage.login('performance_glitch_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/, { timeout: SLOW_TIMEOUT });
    const elapsed = Date.now() - start;

    // Login should complete — even if slow — within 10 seconds
    expect(elapsed).toBeLessThan(10_000);
  });

  test('TC_PERF_002 - inventory page loads after slow login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('performance_glitch_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/, { timeout: SLOW_TIMEOUT });

    const inventory = new InventoryPage(page);
    await expect(inventory.pageTitle).toHaveText('Products', { timeout: SLOW_TIMEOUT });
    await expect(inventory.productCards.first()).toBeVisible({ timeout: SLOW_TIMEOUT });
  });

  test('TC_PERF_003 - cart operations complete despite slow response', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('performance_glitch_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/, { timeout: SLOW_TIMEOUT });

    const inventory = new InventoryPage(page);
    await inventory.addProductToCartByName('Sauce Labs Backpack');
    // Badge should eventually reflect the add even if it is delayed
    await expect(inventory.cartBadge).toHaveText('1', { timeout: SLOW_TIMEOUT });
  });
});
