const { test, expect } = require('@playwright/test');
const { InventoryPage } = require('../../pages/InventoryPage');
const { CartPage } = require('../../pages/CartPage');
const { CheckoutStepOnePage } = require('../../pages/CheckoutPage');
const { loginAsStandardUser } = require('../../utils/helper');
const { MESSAGES } = require('../../utils/constants');

test.describe('Checkout Step 1', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsStandardUser(page);
    const inventory = new InventoryPage(page);
    await inventory.addProductToCartByName('Sauce Labs Backpack');
    await inventory.goToCart();
    const cart = new CartPage(page);
    await cart.checkout();
  });

  test('TC_K1_001 - all fields empty shows First Name required error', async ({ page }) => {
    const step1 = new CheckoutStepOnePage(page);
    await step1.fillInfo('', '', '');
    await step1.continueCheckout();
    await expect(page.locator('[data-test="error"]')).toContainText(MESSAGES.firstNameRequired);
    await expect(page).toHaveURL(/checkout-step-one/);
  });

  test('TC_K1_002 - First Name empty shows First Name required error', async ({ page }) => {
    const step1 = new CheckoutStepOnePage(page);
    await step1.fillInfo('', 'Doe', '12345');
    await step1.continueCheckout();
    await expect(page.locator('[data-test="error"]')).toContainText(MESSAGES.firstNameRequired);
  });

  test('TC_K1_003 - Last Name empty shows Last Name required error', async ({ page }) => {
    const step1 = new CheckoutStepOnePage(page);
    await step1.fillInfo('John', '', '12345');
    await step1.continueCheckout();
    await expect(page.locator('[data-test="error"]')).toContainText(MESSAGES.lastNameRequired);
  });

  test('TC_K1_004 - Zip Code empty shows Postal Code required error', async ({ page }) => {
    const step1 = new CheckoutStepOnePage(page);
    await step1.fillInfo('John', 'Doe', '');
    await step1.continueCheckout();
    await expect(page.locator('[data-test="error"]')).toContainText(MESSAGES.postalCodeRequired);
  });

  test('TC_K1_005 - Cancel returns to Cart page', async ({ page }) => {
    const step1 = new CheckoutStepOnePage(page);
    await step1.cancel();
    await expect(page).toHaveURL(/cart\.html/);
  });

  test('TC_K1_006 - Continue with valid data navigates to Checkout Step Two', async ({ page }) => {
    const step1 = new CheckoutStepOnePage(page);
    await step1.fillInfo('John', 'Doe', '12345');
    await step1.continueCheckout();
    await expect(page).toHaveURL(/checkout-step-two/);
  });
});
