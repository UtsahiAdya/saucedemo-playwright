const { test, expect } = require('@playwright/test');
const { InventoryPage } = require('../../pages/InventoryPage');
const { CartPage } = require('../../pages/CartPage');
const { loginAsStandardUser } = require('../../utils/helper');

const P1 = 'Sauce Labs Backpack';
const P2 = 'Sauce Labs Bike Light';

test.describe('Cart Page', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsStandardUser(page);
  });

  test('TC_CART_001 - quantity of each cart item defaults to 1', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addProductToCartByName(P1);
    await inventory.goToCart();
    const cart = new CartPage(page);
    await expect(cart.itemQuantities.first()).toHaveText('1');
  });

  test('TC_CART_002 - cart count increases by 1 when a product is added', async ({ page }) => {
    const inventory = new InventoryPage(page);
    const before = await inventory.getCartCount();
    await inventory.addProductToCartByName(P1);
    expect(await inventory.getCartCount()).toBe(before + 1);
  });

  test('TC_CART_003 - cart count decreases by 1 when a product is removed', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addProductToCartByName(P1);
    await inventory.addProductToCartByName(P2);
    const before = await inventory.getCartCount();
    await inventory.removeProductByName(P1);
    expect(await inventory.getCartCount()).toBe(before - 1);
  });

  test('TC_CART_004 - "Continue Shopping" returns to Products/Home page', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addProductToCartByName(P1);
    await inventory.goToCart();
    const cart = new CartPage(page);
    await cart.continueShoppingBtn.click();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('TC_CART_005 - "Checkout" navigates to Checkout Step One', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addProductToCartByName(P1);
    await inventory.goToCart();
    const cart = new CartPage(page);
    await cart.checkout();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });
});
