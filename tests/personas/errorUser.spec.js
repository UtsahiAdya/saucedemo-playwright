 const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { InventoryPage } = require('../../pages/InventoryPage');
const { CartPage } = require('../../pages/CartPage');

test.describe('Persona: error_user', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('error_user', 'secret_sauce');

    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('TC_ERR_001 - Login succeeds and user reaches Products page', async ({ page }) => {
    await expect(page.locator('.title')).toHaveText('Products');
    await expect(page.locator('.inventory_item')).toHaveCount(6);
  });

  test('TC_ERR_002 - Products page displays all product cards', async ({ page }) => {
    const inventory = new InventoryPage(page);

    await expect(inventory.productCards).toHaveCount(6);

    await expect(inventory.productCards.first()).toBeVisible();
  });

  test('TC_ERR_003 - Product sorting keeps all products visible', async ({ page }) => {
    const inventory = new InventoryPage(page);

    const before = await inventory.productCards.count();

    await inventory.sortBy('za');

    const after = await inventory.productCards.count();

    expect(after).toBe(before);

    await expect(inventory.productCards.first()).toBeVisible();
  });

  test('TC_ERR_004 - User can add a product to cart', async ({ page }) => {
    const inventory = new InventoryPage(page);

    await inventory.addProductToCartByName('Sauce Labs Backpack');

    expect(await inventory.getCartCount()).toBe(1);
  });

  test('TC_ERR_005 - Cart page is accessible after adding a product', async ({ page }) => {
    const inventory = new InventoryPage(page);

    await inventory.addProductToCartByName('Sauce Labs Backpack');

    await inventory.goToCart();

    await expect(page).toHaveURL(/cart\.html/);

    const cart = new CartPage(page);

    expect(await cart.getItemCount()).toBe(1);
  });

  test('TC_ERR_006 - Checkout Step One is accessible', async ({ page }) => {
    const inventory = new InventoryPage(page);

    await inventory.addProductToCartByName('Sauce Labs Backpack');

    await inventory.goToCart();

    await page.locator('[data-test="checkout"]').click();

    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  test('TC_ERR_007 - Application remains responsive during user interactions', async ({ page }) => {
    const inventory = new InventoryPage(page);

    await inventory.sortBy('az');

    await inventory.addProductToCartByName('Sauce Labs Backpack');

    await inventory.goToCart();

    await expect(page).toHaveURL(/cart\.html/);

    await expect(page.locator('.cart_item')).toHaveCount(1);
  });

});