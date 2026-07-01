const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { InventoryPage } = require('../../pages/InventoryPage');
const { CartPage } = require('../../pages/CartPage');
const { CheckoutStepOnePage, CheckoutStepTwoPage, CheckoutCompletePage } = require('../../pages/CheckoutPage');

// visual_user simulates layout/CSS regressions:
//   - All functional behaviour works correctly (text, clicks, navigation)
//   - Layout bugs exist: misaligned elements, wrong colours, wrong positions
//   - Standard assertions pass — only screenshot diffs catch the real bugs
//
// Screenshot tests require baselines to exist before they can compare.
// Generate baselines ONCE with:  npx playwright test --update-snapshots
// After that, CI runs diff against the stored PNGs automatically.
//
// These tests are placed in a separate describe block tagged @visual
// so they can be skipped in fast CI runs and only executed on schedule:
//   npx playwright test --grep @visual

test.describe('Persona: visual_user — functional smoke', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('visual_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('TC_VIS_001 - login succeeds and inventory page loads', async ({ page }) => {
    await expect(page.locator('.title')).toHaveText('Products');
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  test('TC_VIS_002 - all 6 product cards are present', async ({ page }) => {
    const inventory = new InventoryPage(page);
    expect(await inventory.productCards.count()).toBe(6);
  });

  test('TC_VIS_003 - Add to Cart works functionally', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addProductToCartByName('Sauce Labs Backpack');
    expect(await inventory.getCartCount()).toBe(1);
  });

  test('TC_VIS_004 - cart page renders correct item count', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addProductToCartByName('Sauce Labs Backpack');
    await inventory.goToCart();
    expect(await new CartPage(page).getItemCount()).toBe(1);
  });

  test('TC_VIS_005 - full checkout flow completes functionally', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addProductToCartByName('Sauce Labs Backpack');
    await inventory.goToCart();
    await new CartPage(page).checkout();
    const step1 = new CheckoutStepOnePage(page);
    await step1.fillInfo('Jane', 'Doe', '12345');
    await step1.continueCheckout();
    await expect(page).toHaveURL(/checkout-step-two/);
    await new CheckoutStepTwoPage(page).finish();
    await expect(new CheckoutCompletePage(page).completeHeader).toHaveText('Thank you for your order!');
  });
});

// ── Visual regression layer ───────────────────────────────────────────────────
// Tag: @visual  — run separately with: npx playwright test --grep @visual
//
// First run (generate baselines):
//   npx playwright test --grep @visual --update-snapshots
//
// Subsequent CI runs (diff against baselines):
//   npx playwright test --grep @visual
//
// Snapshots are stored in: tests/personas/__snapshots__/
// Commit the snapshot PNGs to git so CI has baselines to compare against.

test.describe('Persona: visual_user — screenshot regression @visual', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('visual_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('TC_VIS_101 - inventory page layout matches baseline @visual', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('visual-user-inventory.png', {
      maxDiffPixelRatio: 0.1,
      mask: [page.locator('.shopping_cart_badge')],
    });
  });

  test('TC_VIS_102 - first product card layout matches baseline @visual', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const firstCard = page.locator('.inventory_item').first();
    await expect(firstCard).toHaveScreenshot('visual-user-product-card.png', {
      maxDiffPixelRatio: 0.1,
    });
  });

  test('TC_VIS_103 - cart page layout matches baseline @visual', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addProductToCartByName('Sauce Labs Backpack');
    await inventory.goToCart();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('visual-user-cart.png', {
      maxDiffPixelRatio: 0.1,
    });
  });

  test('TC_VIS_104 - checkout step 1 layout matches baseline @visual', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addProductToCartByName('Sauce Labs Backpack');
    await inventory.goToCart();
    await new CartPage(page).checkout();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('visual-user-checkout-step1.png', {
      maxDiffPixelRatio: 0.1,
    });
  });
});
