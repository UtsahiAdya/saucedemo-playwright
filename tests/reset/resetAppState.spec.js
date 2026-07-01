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

  // test('TC_RESET_002 - Reset reverts "Remove" buttons back to "Add to cart"', async ({ page }) => {
  //   const inventory = new InventoryPage(page);
  //   await inventory.addProductToCartByName(P1);
  //   await expect(inventory.productCardByName(P1).locator('button[id^="remove"]')).toBeVisible();

  //   // resetAppState opens the menu and clicks reset — menu stays open after reset
  //   // close the menu first so it doesn't overlay the inventory cards
  //   await inventory.openMenu();
  //   await inventory.resetLink.click();
  //   await inventory.closeMenu();

  //   await expect(inventory.productCardByName(P1).locator('button[id^="add-to-cart"]')).toBeVisible();
  // });

//   test('TC_RESET_002 - Reset reverts "Remove" buttons back to "Add to cart"', async ({ page }) => {
//   const inventory = new InventoryPage(page);

//   // Add a product
//   await inventory.addProductToCartByName('Sauce Labs Backpack');

//   // Verify button changed to Remove
//   await expect(
//     page.getByTestId('remove-sauce-labs-backpack')
//   ).toBeVisible();

//   // Reset application state
//   await inventory.resetAppState();

//   // Verify button changed back to Add to Cart
//   await expect(
//     page.getByTestId('add-to-cart-sauce-labs-backpack')
//   ).toBeVisible();

//   // Badge should disappear
//   await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
// });
  

test('TC_RESET_002 - Reset reverts "Remove" buttons back to "Add to cart"', async ({ page }) => {
  const inventory = new InventoryPage(page);

  const backpackCard = page.locator('.inventory_item').filter({
    hasText: 'Sauce Labs Backpack'
  });

  const button = backpackCard.locator('button');

  await button.click();

  await expect(button).toHaveText('Remove');

  await inventory.resetAppState();

  await expect(button).toHaveText('Add to cart');

  await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
});
  
  test('TC_RESET_003 - Reset does not log the user out', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.resetAppState();
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('#login-button')).not.toBeVisible();
  });

  // test('TC_RESET_004 - Reset does not navigate away from current page', async ({ page }) => {
  //   const inventory = new InventoryPage(page);
  //   const urlBefore = page.url();
  //   await inventory.resetAppState();
  //   expect(page.url()).toBe(urlBefore);
  // });

  test('TC_RESET_004 - Reset does not navigate away from current page', async ({ page }) => {
  const inventory = new InventoryPage(page);

  const currentURL = page.url();

  await inventory.resetAppState();

  await expect(page).toHaveURL(currentURL);

  // Products page should still be displayed
  await expect(page.locator('.title')).toHaveText('Products');
});

  test('TC_RESET_005 - Reset empties items in Cart page view', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addProductToCartByName(P1);
    await inventory.goToCart();
    await inventory.resetAppState();
    await page.goto('/cart.html');
    await expect(page.locator('.cart_item')).toHaveCount(0);
  });

  test('TC_RESET_006 - Reset with already-empty cart causes no error', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.resetAppState();
    await expect(page.locator('body')).not.toContainText('TypeError');
    expect(await inventory.getCartCount()).toBe(0);
  });
});
