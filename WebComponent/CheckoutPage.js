const { By, until } = require('selenium-webdriver');
const fs = require('fs');

class CheckoutPage {
    constructor(driver) {
        this.driver = driver;
        this.firstNameInput = By.id('first-name');
        this.lastNameInput = By.id('last-name');
        this.zipCodeInput = By.id('postal-code');
        this.continueButton = By.css('.continue');
        this.finishButton = By.css('.finish');
        this.completeHeader = By.css('.complete-header');
    }

    async enterShippingDetails(firstName, lastName, zipCode) {
        try {
            await this.driver.findElement(this.firstNameInput).sendKeys(firstName);
            await this.driver.findElement(this.lastNameInput).sendKeys(lastName);
            await this.driver.findElement(this.zipCodeInput).sendKeys(zipCode);
            console.log("Informasi checkout berhasil dimasukkan");
        } catch (error) {
            console.error("Error saat mengisi informasi checkout:", error);
            throw error;
        }
    }

    async clickContinue() {
        try {
            const continueButton = await this.driver.wait(
                until.elementLocated(this.continueButton),
                15000
            );
            await this.driver.wait(until.elementIsVisible(continueButton), 15000);
            await continueButton.click();
            console.log("Tombol Continue berhasil diklik");
        } catch (error) {
            console.error("Error saat klik tombol Continue:", error);
            const screenshot = await this.driver.takeScreenshot();
            fs.writeFileSync(`./debug_continue_error_${Date.now()}.png`, screenshot, 'base64');
            throw error;
        }
    }

    async completeCheckout() {
        try {
            const finishButton = await this.driver.wait(
                until.elementLocated(this.finishButton),
                15000
            );
            await this.driver.wait(until.elementIsVisible(finishButton), 15000);
            await finishButton.click();
            console.log("Checkout berhasil diselesaikan");
        } catch (error) {
            console.error("Error saat klik tombol Finish:", error);
            throw error;
        }
    }

    async getCheckoutSuccessMessage() {
        try {
            const element = await this.driver.findElement(this.completeHeader);
            return await element.getText();
        } catch (error) {
            console.error("Error mendapatkan pesan sukses:", error);
            throw error;
        }
    }
}

module.exports = CheckoutPage;
