const { test, expect } = require('@playwright/test');
const { InventoryPage } = require('../../pages/InventoryPage');
const { loginAsStandardUser } = require('../../utils/helper');

test.describe('Products - Sorting', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsStandardUser(page);
  });

  test('TC_PROD_003 - A to Z sorts products alphabetically', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.sortBy('az');
    const names = await inventory.getProductNamesList();
    expect(names[0].localeCompare(names[1])).toBeLessThanOrEqual(0);
  });

  test('TC_PROD_004 - Z to A sorts products in reverse alphabetical order', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.sortBy('za');
    const names = await inventory.getProductNamesList();
    expect(names[0].localeCompare(names[1])).toBeGreaterThanOrEqual(0);
  });

  test('TC_PROD_005 - Price low to high sorts ascending', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.sortBy('lohi');
    const prices = await inventory.getProductPricesList();
    expect(prices[0]).toBeLessThanOrEqual(prices[1]);
  });

  test('TC_PROD_006 - Price high to low sorts descending', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.sortBy('hilo');
    const prices = await inventory.getProductPricesList();
    expect(prices[0]).toBeGreaterThanOrEqual(prices[1]);
  });
});
