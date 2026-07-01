const { test, expect } = require('@playwright/test');
const { InventoryPage } = require('../../pages/InventoryPage');
const { ProductDetailPage } = require('../../pages/ProductDetailPage');
const { loginAsStandardUser } = require('../../utils/helper');

const PRODUCT = 'Sauce Labs Backpack';

test.describe('Product Description Page', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsStandardUser(page);
  });

  test('TC_PD_001 - price on detail page matches Products page', async ({ page }) => {
    const inventory = new InventoryPage(page);
    const priceOnList = await inventory.productCardByName(PRODUCT)
      .locator('.inventory_item_price').innerText();
    await inventory.openProductByName(PRODUCT);
    const detail = new ProductDetailPage(page);
    await expect(detail.price).toHaveText(priceOnList);
  });

  test('TC_PD_002 - Add to Cart button is present on detail page', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.openProductByName(PRODUCT);
    const detail = new ProductDetailPage(page);
    await expect(detail.addToCartBtn).toBeVisible();
  });

  test('TC_PD_003 - description on detail page matches Products page', async ({ page }) => {
    const inventory = new InventoryPage(page);
    const descOnList = await inventory.productCardByName(PRODUCT)
      .locator('.inventory_item_desc').innerText();
    await inventory.openProductByName(PRODUCT);
    const detail = new ProductDetailPage(page);
    await expect(detail.desc).toHaveText(descOnList);
  });

  test('TC_PD_004 - "Back to Products" returns to Products page', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.openProductByName(PRODUCT);
    const detail = new ProductDetailPage(page);
    await detail.goBackToProducts();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('TC_PD_005 - cart icon from detail page navigates to Cart page', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.openProductByName(PRODUCT);
    const detail = new ProductDetailPage(page);
    await detail.goToCart();
    await expect(page).toHaveURL(/cart\.html/);
  });
});
