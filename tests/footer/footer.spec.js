const { test, expect } = require('@playwright/test');
const { InventoryPage } = require('../../pages/InventoryPage');
const { loginAsStandardUser } = require('../../utils/helper');

test.describe('Footer', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsStandardUser(page);
  });

  test('TC_FOOTER_001 - footer shows correct copyright text', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await expect(inventory.footer).toContainText('Sauce Labs');
    await expect(inventory.footer).toContainText('Terms of Service | Privacy Policy');
  });

  test('TC_FOOTER_002 - X/Twitter icon links to X only (not Facebook or LinkedIn)', async ({ page }) => {
    const inventory = new InventoryPage(page);
    const href = await inventory.twitterLink.getAttribute('href');
    expect(href).toMatch(/twitter\.com|x\.com/);
    expect(href).not.toMatch(/facebook\.com/);
    expect(href).not.toMatch(/linkedin\.com/);
  });

  test('TC_FOOTER_003 - Facebook icon links to Facebook only (not X or LinkedIn)', async ({ page }) => {
    const inventory = new InventoryPage(page);
    const href = await inventory.facebookLink.getAttribute('href');
    expect(href).toMatch(/facebook\.com/);
    expect(href).not.toMatch(/twitter\.com|x\.com/);
    expect(href).not.toMatch(/linkedin\.com/);
  });

  test('TC_FOOTER_004 - LinkedIn icon links to LinkedIn only (not Facebook or X)', async ({ page }) => {
    const inventory = new InventoryPage(page);
    const href = await inventory.linkedinLink.getAttribute('href');
    expect(href).toMatch(/linkedin\.com/);
    expect(href).not.toMatch(/facebook\.com/);
    expect(href).not.toMatch(/twitter\.com|x\.com/);
  });
});
