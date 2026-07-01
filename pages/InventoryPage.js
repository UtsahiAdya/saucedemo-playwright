const { BasePage } = require('../utils/BasePage');

class InventoryPage extends BasePage {
  constructor(page) {
    super(page);
    this.pageTitle      = page.locator('.title');
    this.sortDropdown   = page.locator('[data-test="product-sort-container"]');
    this.productCards   = page.locator('.inventory_item');
    this.productNames   = page.locator('.inventory_item_name');
    this.productPrices  = page.locator('.inventory_item_price');
    this.addToCartButtons = page.locator('button[id^="add-to-cart"]');
  }

  async goto() {
    await this.page.goto('/inventory.html');
  }

  async sortBy(optionValue) {
    await this.sortDropdown.selectOption(optionValue);
  }

  async getProductNamesList() {
    return this.productNames.allInnerTexts();
  }

  async getProductPricesList() {
    const texts = await this.productPrices.allInnerTexts();
    return texts.map((t) => parseFloat(t.replace('$', '')));
  }

  productCardByName(name) {
    return this.page.locator('.inventory_item', { hasText: name });
  }

  async addProductToCartByName(name) {
    await this.productCardByName(name).locator('button[id^="add-to-cart"]').click();
  }

  async removeProductByName(name) {
    await this.productCardByName(name).locator('button[id^="remove"]').click();
  }

  async openProductByName(name) {
    await this.page.locator('.inventory_item_name', { hasText: name }).click();
  }
}

module.exports = { InventoryPage };
