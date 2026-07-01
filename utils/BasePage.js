class BasePage {
  constructor(page) {
    this.page = page;
    this.burgerMenuBtn  = page.locator('#react-burger-menu-btn');
    this.closeMenuBtn   = page.locator('#react-burger-cross-btn');
    this.menuWrapper    = page.locator('.bm-menu-wrap');
    this.logoutLink     = page.locator('#logout_sidebar_link');
    this.aboutLink      = page.locator('#about_sidebar_link');
    this.resetLink      = page.locator('#reset_sidebar_link');
    this.cartIcon       = page.locator('.shopping_cart_link');
    this.cartBadge      = page.locator('.shopping_cart_badge');
    this.footer         = page.locator('.footer_copy');
    this.twitterLink    = page.locator('.social_twitter a');
    this.facebookLink   = page.locator('.social_facebook a');
    this.linkedinLink   = page.locator('.social_linkedin a');
  }

  async openMenu() {
    await this.burgerMenuBtn.click();
    await this.menuWrapper.waitFor({ state: 'visible' });
  }

  async closeMenu() {
    await this.closeMenuBtn.click();
  }

  async isMenuOpen() {
    return (await this.menuWrapper.getAttribute('aria-hidden')) === 'false';
  }

  async logout() {
    await this.openMenu();
    await this.logoutLink.click();
  }

  async resetAppState() {
    await this.openMenu();
    await this.resetLink.click();
  }

  async goToCart() {
    await this.cartIcon.click();
  }

  async getCartCount() {
    if ((await this.cartBadge.count()) === 0) return 0;
    return parseInt(await this.cartBadge.innerText(), 10);
  }
}

module.exports = { BasePage };
