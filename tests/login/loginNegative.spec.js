const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const users = require('../../test-data/users.json');

test.describe('Login - Negative', () => {
  test('TC_LOGIN_002 - valid username + invalid password shows error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.invalidPassword.username, users.invalidPassword.password);
    await expect(page.locator('[data-test="error"]')).toContainText(users.genericErrorMessage);
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  test('TC_LOGIN_003 - invalid username + valid password shows error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.invalidUsername.username, users.invalidUsername.password);
    await expect(page.locator('[data-test="error"]')).toContainText(users.genericErrorMessage);
  });

  test('TC_LOGIN_004 - locked_out_user is rejected with specific error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.lockedOutUser.username, users.lockedOutUser.password);
    await expect(page.locator('[data-test="error"]')).toContainText('locked out');
  });

  test('TC_LOGIN_006 - empty credentials shows username required error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('', '');
    await expect(page.locator('[data-test="error"]')).toContainText('Username is required');
  });
});
