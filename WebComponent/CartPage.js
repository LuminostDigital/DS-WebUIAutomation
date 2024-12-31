const { By, until } = require('selenium-webdriver');

class CartPage {
    constructor(driver) {
        this.driver = driver;
        this.cartBadge = By.css('.shopping_cart_badge');
        this.cartIcon = By.css('.shopping_cart_link');
        this.itemInCartLocator = By.css(".inventory_item_name");
        this.checkoutButton = By.id('checkout');
    }

    async getCartBadgeText() {
        try {
            const badge = await this.driver.findElement(this.cartBadge);
            return await badge.getText();
        } catch (err) {
            console.warn("Cart badge not found. Assuming cart is empty.", err);
            return "0";
        }
    }

    async isItemInCart() {
        try {
            await this.driver.findElement(this.cartIcon).click();
            await this.driver.wait(until.elementLocated(this.itemInCartLocator), 10000);
            return true;
        } catch (err) {
            console.error("Error finding item in cart:", err);
            return false;
        }
    }

    async proceedToCheckout() {
        const checkoutButtonElement = await this.driver.findElement(this.checkoutButton);
        await this.driver.wait(until.elementIsVisible(checkoutButtonElement), 10000);
        await this.driver.wait(until.elementIsEnabled(checkoutButtonElement), 10000);
        await checkoutButtonElement.click();
    }
}

module.exports = CartPage;
