class CheckoutStepOnePage {
  constructor(page) {
    this.page           = page;
    this.firstNameInput  = page.locator('#first-name');
    this.lastNameInput   = page.locator('#last-name');
    this.postalCodeInput = page.locator('#postal-code');
    this.continueBtn     = page.locator('#continue');
    this.cancelBtn       = page.locator('#cancel');
    this.errorMessage    = page.locator('[data-test="error"]');
  }

  async fillInfo(firstName, lastName, postalCode) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continueCheckout() {
    await this.continueBtn.click();
  }

  async cancel() {
    await this.cancelBtn.click();
  }
}

class CheckoutStepTwoPage {
  constructor(page) {
    this.page           = page;
    this.cartItems      = page.locator('.cart_item');
    this.subtotalLabel  = page.locator('.summary_subtotal_label');
    this.taxLabel       = page.locator('.summary_tax_label');
    this.totalLabel     = page.locator('.summary_total_label');
    this.finishBtn      = page.locator('#finish');
    this.cancelBtn      = page.locator('#cancel');
  }

  async getItemCount() {
    return this.cartItems.count();
  }

  async getSubtotal() {
    const text = await this.subtotalLabel.innerText();
    return parseFloat(text.replace('Item total: $', ''));
  }

  async getTax() {
    const text = await this.taxLabel.innerText();
    return parseFloat(text.replace('Tax: $', ''));
  }

  async getTotal() {
    const text = await this.totalLabel.innerText();
    return parseFloat(text.replace('Total: $', ''));
  }

  async finish() {
    await this.finishBtn.click();
  }

  async cancel() {
    await this.cancelBtn.click();
  }
}

class CheckoutCompletePage {
  constructor(page) {
    this.page           = page;
    this.completeHeader = page.locator('.complete-header');
    this.backHomeBtn    = page.locator('#back-to-products');
  }

  async backHome() {
    await this.backHomeBtn.click();
  }
}

module.exports = { CheckoutStepOnePage, CheckoutStepTwoPage, CheckoutCompletePage };
