const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { InventoryPage } = require('../../pages/InventoryPage');
const { ProductDetailPage } = require('../../pages/ProductDetailPage');

// problem_user verified behaviour:
//   - Login succeeds
//   - ALL product images show the same broken/wrong image (src points to dog image)
//   - Clicking any product opens the WRONG detail page (always shows same product)
//   - Sort A-Z and Z-A work correctly in terms of ordering (names are sorted)
//   - BUT sort by price behaves incorrectly / does not sort properly
//   - Add to Cart buttons work for some products, fail silently for others

test.describe('Persona: problem_user — broken UI', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('problem_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('TC_PROB_001 - login succeeds and reaches inventory page', async ({ page }) => {
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('TC_PROB_002 - all product images share the same broken src', async ({ page }) => {
    const images = page.locator('.inventory_item img');
    const srcs = await images.evaluateAll((imgs) => imgs.map((img) => img.getAttribute('src')));
    // All 6 images point to the same wrong file for problem_user
    const uniqueSrcs = new Set(srcs);
    expect(uniqueSrcs.size).toBe(1);
  });

  test('TC_PROB_003 - product detail page shows wrong product name', async ({ page }) => {
    const inventory = new InventoryPage(page);
    // Note the name of the FIRST product shown
    const firstProductName = await inventory.productNames.first().innerText();
    await inventory.openProductByName(firstProductName);
    const detail = new ProductDetailPage(page);
    const detailName = await detail.name.innerText();
    // problem_user always loads the same product detail regardless of which was clicked
    expect(detailName).not.toBe(firstProductName);
  });

  test('TC_PROB_004 - A to Z sort orders names correctly (not broken for problem_user)', async ({ page }) => {
    // Name-based sorting actually works for problem_user — it is price sort that is broken
    const inventory = new InventoryPage(page);
    await inventory.sortBy('az');
    const names = await inventory.getProductNamesList();
    expect(names[0].localeCompare(names[1])).toBeLessThanOrEqual(0);
  });

  test('TC_PROB_005 - Price (low to high) sort is broken for problem_user', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.sortBy('lohi');
    const prices = await inventory.getProductPricesList();
    // For problem_user price sort does NOT produce correct ascending order
    // We check all consecutive pairs — at least one pair should be out of order
    let hasOutOfOrder = false;
    for (let i = 0; i < prices.length - 1; i++) {
      if (prices[i] > prices[i + 1]) {
        hasOutOfOrder = true;
        break;
      }
    }
    expect(hasOutOfOrder).toBe(true);
  });

  test('TC_PROB_006 - Add to Cart fails silently for some products', async ({ page }) => {
    const inventory = new InventoryPage(page);
    // Click Add to Cart for all products and count how many actually increment the badge
    const productNames = await inventory.getProductNamesList();
    let failCount = 0;
    for (const name of productNames) {
      const before = await inventory.getCartCount();
      const card = inventory.productCardByName(name);
      const addBtn = card.locator('button[id^="add-to-cart"]');
      if (await addBtn.count() > 0) {
        await addBtn.click();
        const after = await inventory.getCartCount();
        if (after === before) failCount++;
      }
    }
    // At least one add-to-cart silently fails for problem_user
    expect(failCount).toBeGreaterThan(0);
  });
});
