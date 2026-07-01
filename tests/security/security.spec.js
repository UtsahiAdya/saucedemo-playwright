const { test, expect } = require('@playwright/test');
const { URLS } = require('../../utils/constants');

const PROTECTED_ROUTES = [
  URLS.inventory,
  URLS.cart,
  URLS.checkoutStepOne,
  URLS.checkoutStepTwo,
  URLS.checkoutComplete,
];

test.describe('Security - Unauthenticated Direct URL Access', () => {
  for (const route of PROTECTED_ROUTES) {
    test(`TC_SEC - blocked: direct access to "${route}" while logged out`, async ({ page }) => {
      await page.goto(route);
      await expect(page).toHaveURL('https://www.saucedemo.com/');
      await expect(page.locator('#login-button')).toBeVisible();
    });
  }
});
