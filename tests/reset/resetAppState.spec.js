const { test, expect } = require('@playwright/test');
const { InventoryPage } = require('../../pages/InventoryPage');
const { loginAsStandardUser } = require('../../utils/helper');

const P1 = 'Sauce Labs Backpack';
const P2 = 'Sauce Labs Bike Light';

test.describe('Reset App State', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsStandardUser(page);
  });

  test('TC_RESET_001 - Reset empties the cart and badge disappears', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addProductToCartByName(P1);
    await inventory.addProductToCartByName(P2);
    expect(await inventory.getCartCount()).toBe(2);
    await inventory.resetAppState();
    expect(await inventory.getCartCount()).toBe(0);
  });
 
  
  test('TC_RESET_002 - Reset does not log the user out', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.resetAppState();
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('#login-button')).not.toBeVisible();
  });

 

  test('TC_RESET_003 - Reset does not navigate away from current page', async ({ page }) => {
  const inventory = new InventoryPage(page);

  const currentURL = page.url();

  await inventory.resetAppState();

  await expect(page).toHaveURL(currentURL);

  // Products page should still be displayed
  await expect(page.locator('.title')).toHaveText('Products');
});

  test('TC_RESET_004 - Reset empties items in Cart page view', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addProductToCartByName(P1);
    await inventory.goToCart();
    await inventory.resetAppState();
    await page.goto('/cart.html');
    await expect(page.locator('.cart_item')).toHaveCount(0);
  });

  test('TC_RESET_005 - Reset with already-empty cart causes no error', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.resetAppState();
    await expect(page.locator('body')).not.toContainText('TypeError');
    expect(await inventory.getCartCount()).toBe(0);
  });
});
