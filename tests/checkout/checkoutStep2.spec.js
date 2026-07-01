const { test, expect } = require('@playwright/test');
const { InventoryPage } = require('../../pages/InventoryPage');
const { CartPage } = require('../../pages/CartPage');
const { CheckoutStepOnePage, CheckoutStepTwoPage } = require('../../pages/CheckoutPage');
const { loginAsStandardUser } = require('../../utils/helper');

async function reachStep2(page) {
  await loginAsStandardUser(page);
  const inventory = new InventoryPage(page);
  await inventory.addProductToCartByName('Sauce Labs Backpack');
  await inventory.addProductToCartByName('Sauce Labs Bike Light');
  await inventory.goToCart();
  const cart = new CartPage(page);
  await cart.checkout();
  const step1 = new CheckoutStepOnePage(page);
  await step1.fillInfo('John', 'Doe', '12345');
  await step1.continueCheckout();
}

test.describe('Checkout Step 2', () => {
  test.beforeEach(async ({ page }) => {
    await reachStep2(page);
  });

  test('TC_K2_001 - item count on Step 2 matches items added to cart', async ({ page }) => {
    const step2 = new CheckoutStepTwoPage(page);
    expect(await step2.getItemCount()).toBe(2);
  });

  test('TC_K2_002 - sum of item prices equals displayed Item Total', async ({ page }) => {
    const step2 = new CheckoutStepTwoPage(page);
    const itemPrices = await page.locator('.inventory_item_price').allInnerTexts();
    const sum = itemPrices.reduce((acc, p) => acc + parseFloat(p.replace('$', '')), 0);
    const subtotal = await step2.getSubtotal();
    expect(Math.abs(sum - subtotal)).toBeLessThan(0.01);
  });

  test('TC_K2_003 - Total equals Item Total + Tax', async ({ page }) => {
    const step2 = new CheckoutStepTwoPage(page);
    const subtotal = await step2.getSubtotal();
    const tax      = await step2.getTax();
    const total    = await step2.getTotal();
    expect(Math.abs(total - (subtotal + tax))).toBeLessThan(0.01);
  });

  test('TC_K2_004 - Cancel returns to inventory/home page', async ({ page }) => {
    // saucedemo Cancel on Step 2 navigates back to /inventory.html, not step-one
    const step2 = new CheckoutStepTwoPage(page);
    await step2.cancel();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('TC_K2_005 - Finish navigates to Checkout Complete page', async ({ page }) => {
    const step2 = new CheckoutStepTwoPage(page);
    await step2.finish();
    await expect(page).toHaveURL(/checkout-complete/);
  });
});
