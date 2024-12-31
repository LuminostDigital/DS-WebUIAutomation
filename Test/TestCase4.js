const { Builder, By, until } = require('selenium-webdriver');
const LoginPage = require('../WebComponent/LoginPage');
const DashboardPage = require('../WebComponent/Dashboard');
const CartPage = require('../WebComponent/CartPage');
const CheckoutPage = require('../WebComponent/CheckoutPage');
const assert = require('assert');
const fs = require('fs');
require('dotenv').config();

const browser = process.env.BROWSER || 'chrome';
const baseUrl = process.env.BASE_URL;
const username = process.env.USER_NAME;
const password = process.env.PASSWORD;

const screenshotDir = './screenshots/';
if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
}

describe('TestCase 4 [carttest & checkout] #Regression', function () {
    this.timeout(40000);
    let driver;
    let options;

    switch (browser.toLowerCase()) {
        case 'firefox':
            const firefox = require('selenium-webdriver/firefox');
            options = new firefox.Options();
            options.addArguments('--headless');
            break;
        case 'edge':
            const edge = require('selenium-webdriver/edge');
            options = new edge.Options();
            options.addArguments('--headless');
            break;
        case 'chrome':
        default:
            const chrome = require('selenium-webdriver/chrome');
            options = new chrome.Options();
            options.addArguments('--headless');
            break;
    }

    before(async function () {
        driver = await new Builder().forBrowser(browser).setChromeOptions(options).build();
    });

    beforeEach(async function () {
        const loginPage = new LoginPage(driver);
        await loginPage.navigate(baseUrl);
        await loginPage.login(username, password);
    });

    it('Add item to cart, proceed to checkout, and complete order', async function () {
        const dashboardPage = new DashboardPage(driver);
        const cartPage = new CartPage(driver);
        const checkoutPage = new CheckoutPage(driver);

        // Tambahkan item ke keranjang
        await dashboardPage.addItemToCart();
        console.log("Tombol Add to Cart berhasil diklik");

        // Validasi badge menunjukkan 1 item
        const badgeText = await cartPage.getCartBadgeText();
        console.log(`Isi badge: ${badgeText}`);
        assert.strictEqual(badgeText, '1', 'Cart badge should display 1 item');

        // Validasi item ada di keranjang
        const isItemInCart = await cartPage.isItemInCart();
        console.log(`Item ditemukan di keranjang: ${isItemInCart}`);
        assert.strictEqual(isItemInCart, true, 'Item should be present in cart');

        // Proses ke halaman checkout
        await cartPage.proceedToCheckout();
        console.log("Berhasil melanjutkan ke halaman checkout");

        // Masukkan informasi checkout
        const firstName = 'John';
        const lastName = 'Doe';
        const zipCode = '12345';
        await checkoutPage.enterShippingDetails(firstName, lastName, zipCode);
        console.log("Informasi checkout berhasil dimasukkan");

        // Validasi halaman checkout summary
        console.log("Memastikan halaman checkout summary...");
        const checkoutSummary = await driver.findElement(By.css('.checkout_summary'));
        await driver.wait(until.elementIsVisible(checkoutSummary), 10000);
        console.log("Berada di halaman checkout summary");

        // Tunggu tombol finish dengan selector alternatif
        console.log("Menunggu tombol 'Finish'...");
        await driver.wait(until.elementLocated(By.css("#finish")), 30000);
        const finishButton = await driver.findElement(By.css("#finish"));
        await driver.wait(until.elementIsVisible(finishButton), 10000);
        await finishButton.click();
        console.log("Checkout selesai, tombol finish berhasil diklik");

        // Validasi halaman akhir
        const successMessage = await checkoutPage.getCheckoutSuccessMessage();
        assert.strictEqual(successMessage, 'Thank you for your order!', 'Expected thank you message to be displayed');
        console.log("Pesanan berhasil diproses, validasi pesan akhir berhasil");
    });

    afterEach(async function () {
        if (this.currentTest.state === 'failed') {
            try {
                const screenshot = await driver.takeScreenshot();
                const filepath = `${screenshotDir}${this.currentTest.title.replace(/\s+/g, '_')}_${Date.now()}.png`;
                fs.writeFileSync(filepath, screenshot, 'base64');
                console.log(`Screenshot saved to: ${filepath}`);
            } catch (error) {
                console.error("Error taking screenshot:", error);
            }
        }
    });

    after(async function () {
        if (driver) {
            await driver.quit();
        }
    });
});
