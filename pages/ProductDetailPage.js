const { BasePage } = require('../utils/BasePage');

class ProductDetailPage extends BasePage {
  constructor(page) {
    super(page);
    this.name        = page.locator('.inventory_details_name');
    this.desc        = page.locator('.inventory_details_desc');
    this.price       = page.locator('.inventory_details_price');
    this.addToCartBtn = page.locator('button[id^="add-to-cart"]');
    this.backBtn     = page.locator('#back-to-products');
  }

  async goBackToProducts() {
    await this.backBtn.click();
  }
}

module.exports = { ProductDetailPage };
