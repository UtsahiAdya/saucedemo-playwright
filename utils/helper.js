const { LoginPage } = require('../pages/LoginPage');

async function loginAsStandardUser(page) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');
}

module.exports = { loginAsStandardUser };
