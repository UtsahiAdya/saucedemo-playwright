const { test, expect } = require('@playwright/test');
const { InventoryPage } = require('../../pages/InventoryPage');
const { CartPage } = require('../../pages/CartPage');
const { loginAsStandardUser } = require('../../utils/helper');

const P1 = 'Sauce Labs Backpack';
const P2 = 'Sauce Labs Bike Light';

test.describe('Products - Add / Remove from Cart', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsStandardUser(page);
  });

  test('TC_PROD_001 - Products page heading is "Products"', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await expect(inventory.pageTitle).toHaveText('Products');
  });

  test('TC_PROD_002 - card count equals Add-to-Cart button count equals price count', async ({ page }) => {
    const inventory = new InventoryPage(page);
    const cards  = await inventory.productCards.count();
    const btns   = await inventory.addToCartButtons.count();
    const prices = await inventory.productPrices.count();
    expect(cards).toBe(btns);
    expect(cards).toBe(prices);
  });

  test('TC_PROD_007 - Add to Cart adds correct product to Cart page (name + desc)', async ({ page }) => {
    const inventory = new InventoryPage(page);
    const card = inventory.productCardByName(P1);
    const expectedDesc = await card.locator('.inventory_item_desc').innerText();
    await inventory.addProductToCartByName(P1);
    await inventory.goToCart();
    const cart = new CartPage(page);
    await expect(cart.cartItems.filter({ hasText: P1 })).toBeVisible();
    await expect(cart.cartItems.filter({ hasText: expectedDesc })).toBeVisible();
  });

  test('TC_PROD_008 - Add to Cart changes button to "Remove" for that product', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addProductToCartByName(P1);
    await expect(inventory.productCardByName(P1).locator('button[id^="remove"]')).toBeVisible();
  });

  test('TC_PROD_009 - non-added product button stays "Add to cart"', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addProductToCartByName(P1);
    await expect(inventory.productCardByName(P2).locator('button[id^="add-to-cart"]')).toBeVisible();
  });

  test('TC_PROD_010 - Remove button removes that product from Cart page', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addProductToCartByName(P1);
    await inventory.removeProductByName(P1);
    expect(await inventory.getCartCount()).toBe(0);
  });

  test('TC_PROD_011 - removing one product does not remove others from cart', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addProductToCartByName(P1);
    await inventory.addProductToCartByName(P2);
    await inventory.removeProductByName(P1);
    expect(await inventory.getCartCount()).toBe(1);
    await expect(inventory.productCardByName(P2).locator('button[id^="remove"]')).toBeVisible();
  });

  test('TC_PROD_012 - clicking a product card navigates to product description page', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.openProductByName(P1);
    await expect(page).toHaveURL(/inventory-item\.html/);
  });

  test('TC_PROD_013 - cart badge shows correct count after adding multiple products', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addProductToCartByName(P1);
    await inventory.addProductToCartByName(P2);
    expect(await inventory.getCartCount()).toBe(2);
  });
});
