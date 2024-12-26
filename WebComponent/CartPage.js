const { By, until } = require('selenium-webdriver');

class CartPage {
    constructor(driver) {
        this.driver = driver;
        this.cartBadge = By.css('.shopping_cart_badge');
        this.addToCartButton = By.id('add-to-cart-sauce-labs-backpack');
        this.cartItem = By.xpath("//div[contains(@class, 'cart_item')]");

    }

    async addItemToCart() {
        await this.driver.findElement(this.addToCartButton).click();
    }

    async getCartBadgeText() {
        try {
            const badge = await this.driver.findElement(this.cartBadge);
            return await badge.getText();
        } catch (err) {
            return null; // Jika badge tidak ada
        }
    }

    async isItemInCart() {
        try {
            // Klik ikon keranjang untuk membuka halaman keranjang
            const cartIcon = await this.driver.findElement(By.className('shopping_cart_link'));
            await cartIcon.click();
    
            // Tunggu hingga elemen cart_item muncul menggunakan XPath
            await this.driver.wait(until.elementLocated(this.cartItem), 10000);
            const items = await this.driver.findElements(this.cartItem);
            return items.length > 0;
        } catch (err) {
            console.error("Error menemukan item di keranjang:", err);
            return false;
        }
    }
}

module.exports = CartPage;
