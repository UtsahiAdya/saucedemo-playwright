const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { InventoryPage } = require('../../pages/InventoryPage');
const { CartPage } = require('../../pages/CartPage');
const { CheckoutStepOnePage, CheckoutStepTwoPage, CheckoutCompletePage } = require('../../pages/CheckoutPage');
const { ProductDetailPage } = require('../../pages/ProductDetailPage');
const { MESSAGES } = require('../../utils/constants');

test.describe('End-to-End Scenarios', () => {
  test('E2E_001 - Full purchase: login → add products → checkout → confirmation → back home', async ({ page }) => {
    // 1. Login
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);

    // 2. Add two products
    const inventory = new InventoryPage(page);
    await inventory.addProductToCartByName('Sauce Labs Backpack');
    await inventory.addProductToCartByName('Sauce Labs Bike Light');
    expect(await inventory.getCartCount()).toBe(2);

    // 3. Cart review
    await inventory.goToCart();
    expect(await new CartPage(page).getItemCount()).toBe(2);

    // 4. Checkout Step 1
    await new CartPage(page).checkout();
    const step1 = new CheckoutStepOnePage(page);
    await step1.fillInfo('Jane', 'Doe', '90210');
    await step1.continueCheckout();
    await expect(page).toHaveURL(/checkout-step-two/);

    // 5. Verify totals
    const step2 = new CheckoutStepTwoPage(page);
    const subtotal = await step2.getSubtotal();
    const tax      = await step2.getTax();
    const total    = await step2.getTotal();
    expect(Math.abs(total - (subtotal + tax))).toBeLessThan(0.01);

    // 6. Finish
    await step2.finish();
    await expect(new CheckoutCompletePage(page).completeHeader).toHaveText(MESSAGES.thankYou);

    // 7. Back Home → empty cart
    await new CheckoutCompletePage(page).backHome();
    await expect(page).toHaveURL(/inventory\.html/);
    expect(await inventory.getCartCount()).toBe(0);
  });

  test('E2E_002 - Sort → open product detail → add to cart → remove → badge clears', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');

    const inventory = new InventoryPage(page);
    await inventory.sortBy('lohi');
    const names = await inventory.getProductNamesList();
    const cheapest = names[0];

    await inventory.openProductByName(cheapest);
    const detail = new ProductDetailPage(page);
    await detail.addToCartBtn.click();
    expect(await detail.getCartCount()).toBe(1);

    await detail.goBackToProducts();
    await inventory.removeProductByName(cheapest);
    expect(await inventory.getCartCount()).toBe(0);
  });

  test('E2E_003 - Logout mid-session → protected route inaccessible', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');

    const inventory = new InventoryPage(page);
    await inventory.addProductToCartByName('Sauce Labs Backpack');
    await inventory.logout();
    await expect(page).toHaveURL('https://www.saucedemo.com/');

    await page.goto('/cart.html');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('#login-button')).toBeVisible();
  });
});
