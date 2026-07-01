const { BasePage } = require('../utils/BasePage');

class CartPage extends BasePage {
  constructor(page) {
    super(page);
    this.cartItems          = page.locator('.cart_item');
    this.itemQuantities     = page.locator('.cart_quantity');
    this.continueShoppingBtn = page.locator('#continue-shopping');
    this.checkoutBtn        = page.locator('#checkout');
  }

  async getItemCount() {
    return this.cartItems.count();
  }

  async checkout() {
    await this.checkoutBtn.click();
  }
}

module.exports = { CartPage };
