const { test, expect } = require('@playwright/test');
const { InventoryPage } = require('../../pages/InventoryPage');
const { CartPage } = require('../../pages/CartPage');
const { CheckoutStepOnePage, CheckoutStepTwoPage, CheckoutCompletePage } = require('../../pages/CheckoutPage');
const { loginAsStandardUser } = require('../../utils/helper');
const { MESSAGES } = require('../../utils/constants');

async function reachComplete(page) {
  await loginAsStandardUser(page);
  const inventory = new InventoryPage(page);
  await inventory.addProductToCartByName('Sauce Labs Backpack');
  await inventory.goToCart();
  await new CartPage(page).checkout();
  const step1 = new CheckoutStepOnePage(page);
  await step1.fillInfo('John', 'Doe', '12345');
  await step1.continueCheckout();
  await new CheckoutStepTwoPage(page).finish();
}

test.describe('Checkout Complete', () => {
  test.beforeEach(async ({ page }) => {
    await reachComplete(page);
  });

  test('TC_KC_001 - confirmation message is "Thank you for your order!"', async ({ page }) => {
    const complete = new CheckoutCompletePage(page);
    await expect(complete.completeHeader).toHaveText(MESSAGES.thankYou);
  });

  test('TC_KC_002 - Back Home navigates to Products page with empty cart', async ({ page }) => {
    const complete = new CheckoutCompletePage(page);
    await complete.backHome();
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('.title')).toHaveText('Products');
    const inventory = new InventoryPage(page);
    expect(await inventory.getCartCount()).toBe(0);
  });
});
