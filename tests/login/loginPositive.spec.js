const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const users = require('../../test-data/users.json');

// Only the clean positive user belongs in the happy-path login loop.
// problem_user / error_user / visual_user / performance_glitch_user all
// reach /inventory.html but exhibit broken behaviour after login — those
// assertions live in tests/personas/ not here.
const positiveUsers = users.validUsers.filter((u) => u.type === 'positive');

test.describe('Login - Positive', () => {
  for (const user of positiveUsers) {
    test(`TC_LOGIN_001 - login succeeds for [${user.username}]`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(user.username, user.password);
      await expect(page).toHaveURL(/inventory\.html/);
      await expect(page.locator('.title')).toHaveText('Products');
    });
  }

  test('TC_LOGIN_005 - Login button with valid creds navigates to Home Page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('.inventory_list')).toBeVisible();
  });
});
