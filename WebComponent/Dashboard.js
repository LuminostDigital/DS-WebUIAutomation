const { By, until } = require('selenium-webdriver');

class DashboardPage {
    constructor(driver) {
        this.driver = driver;
        this.addToCartButton = By.id('add-to-cart-sauce-labs-backpack');
        this.productTitle = By.className("title");
    }

    /**
     * Method to add an item to the cart
     */
    async addItemToCart() {
        try {
            const addToCartButtonElement = await this.driver.findElement(this.addToCartButton);
            await this.driver.wait(until.elementIsVisible(addToCartButtonElement), 10000); // Wait until visible
            await this.driver.wait(until.elementIsEnabled(addToCartButtonElement), 10000); // Wait until enabled
            await addToCartButtonElement.click();
            console.log("Item added to cart successfully");
        } catch (error) {
            console.error("Error adding item to cart:", error.message);
            throw error;
        }
    }

    /**
     * Method to verify if on dashboard
     * @returns {Promise<string>} - Returns the title text
     */
    async isOnDashboard() {
        try {
            const titleElement = await this.driver.findElement(this.productTitle);
            await this.driver.wait(until.elementIsVisible(titleElement), 10000); // Wait until visible
            const titleText = await titleElement.getText();
            console.log(`Dashboard title: ${titleText}`);
            return titleText;
        } catch (error) {
            console.error("Error getting title dashboard:", error.message);
            throw error;
        }
    }
}

module.exports = DashboardPage;
