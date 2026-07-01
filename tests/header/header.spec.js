const { test, expect } = require('@playwright/test');
const { InventoryPage } = require('../../pages/InventoryPage');
const { loginAsStandardUser } = require('../../utils/helper');

test.describe('Header', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsStandardUser(page);
  });

  test('TC_HEADER_001 - page title is "Swag Labs" and heading is "Products"', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await expect(page).toHaveTitle(/Swag Labs/);
    await expect(inventory.pageTitle).toHaveText('Products');
  });

  test('TC_HEADER_002 - hamburger menu opens; aria-hidden becomes false', async ({ page }) => {
    const inventory = new InventoryPage(page);
    expect(await inventory.isMenuOpen()).toBeFalsy();
    await inventory.openMenu();
    expect(await inventory.isMenuOpen()).toBeTruthy();
  });

  test('TC_HEADER_003 - close button shuts the menu; aria-hidden reverts to true', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.openMenu();
    expect(await inventory.isMenuOpen()).toBeTruthy();
    await inventory.closeMenu();
    expect(await inventory.isMenuOpen()).toBeFalsy();
  });
});
