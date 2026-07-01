const { test, expect } = require('@playwright/test');
const { InventoryPage } = require('../../pages/InventoryPage');
const { loginAsStandardUser } = require('../../utils/helper');

test.describe('Logout', () => {
  test('TC_LOUT_001 - Logout redirects to sign-in page', async ({ page }) => {
    await loginAsStandardUser(page);
    const inventory = new InventoryPage(page);
    await inventory.logout();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('#login-button')).toBeVisible();
  });
});

// test.describe('About', () => {
//   test('TC_ABOUT_001 - About link navigates to Sauce Labs website', async ({ page, context }) => {
//     await loginAsStandardUser(page);
//     const inventory = new InventoryPage(page);
//     await inventory.openMenu();

//     // About opens in the same tab — wait for a new page OR url change
//     const [newPage] = await Promise.all([
//       context.waitForEvent('page').catch(() => null),
//       inventory.aboutLink.click(),
//     ]);

//     // Some browsers open in same tab, some open new tab
//     const targetPage = newPage || page;
//     await targetPage.waitForURL(/saucelabs\.com/, { timeout: 15000 });
//     await expect(targetPage).toHaveURL(/saucelabs\.com/);
//   });

  

//   test('TC_ABOUT_002 - navigating back from About returns to Home page', async ({ page }) => {
//     await loginAsStandardUser(page);
//     const inventory = new InventoryPage(page);
//     await inventory.openMenu();
//     await inventory.aboutLink.click();
//     // Wait for navigation away from saucedemo
//     await page.waitForURL(/saucelabs\.com/, { timeout: 15000 }).catch(() => {});
//     await page.goBack();
//     await page.waitForURL(/inventory\.html/, { timeout: 10000 });
//     await expect(page).toHaveURL(/inventory\.html/);
//   });
// });



test.describe('About', () => {
  test('TC_ABOUT_001 - About link navigates to Sauce Labs website', async ({ page }) => {
    await loginAsStandardUser(page);

    const inventory = new InventoryPage(page);
    await inventory.openMenu();

    // await Promise.all([
    //   page.waitForURL(/saucelabs\.com/, { timeout: 15000 }),
    //   inventory.aboutLink.click(),
    // ]);

    // await expect(page).toHaveURL(/saucelabs\.com/);
    await Promise.all([
    page.waitForURL(/saucelabs\.com/),
    inventory.aboutLink.click()
]);

await expect(page).toHaveURL(/saucelabs\.com/);
  });

  test('TC_ABOUT_002 - Navigating back from About returns to the Products page', async ({ page }) => {
    await loginAsStandardUser(page);

    const inventory = new InventoryPage(page);
    await inventory.openMenu();

    // await Promise.all([
    //   page.waitForURL(/saucelabs\.com/, { timeout: 15000 }),
    //   inventory.aboutLink.click(),
    // ]);

    // await page.goBack();

    // await expect(page).toHaveURL(/inventory\.html/);

    await Promise.all([
    page.waitForURL(/saucelabs\.com/),
    inventory.aboutLink.click()
]);

await page.goBack();

await expect(page).toHaveURL(/inventory\.html/);
  });
});