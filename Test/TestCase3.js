const { Builder } = require('selenium-webdriver');
const LoginPage = require('../WebComponent/LoginPage');
const DashboardPage = require('../WebComponent/Dashboard');
const CartPage = require('../WebComponent/CartPage'); // Tambahkan CartPage
const assert = require('assert');
const fs = require('fs');

const screenshotDir = './screenshots/';
if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
}

describe('TestCase 3', function () {
    this.timeout(40000);
    let driver;

    // Run setiap mulai test, satu kali saja paling awal
    before(async function () {
        driver = await new Builder().forBrowser('chrome').build();
    });

    // Test Suite dimulai dengan apa, setiap melakukan tes
    beforeEach(async function () {
        const loginPage = new LoginPage(driver);
        await loginPage.navigate();
        await loginPage.login('standard_user', 'secret_sauce');
    });

    // Assertion atau validasi
    it('Login successfully and verify dashboard', async function () {
        const dashboardPage = new DashboardPage(driver);
        const title = await dashboardPage.isOnDashboard();
        assert.strictEqual(title, 'Products', 'Expected dashboard title to be Products');
    });

    it('Add item to cart and verify cart', async function () {
        const cartPage = new CartPage(driver);
    
        // Tambahkan item ke keranjang
        await cartPage.addItemToCart();
        console.log("Tombol Add to Cart berhasil diklik");
    
        // Validasi badge menunjukkan 1 item
        const badgeText = await cartPage.getCartBadgeText();
        console.log(`Isi badge: ${badgeText}`);
        assert.strictEqual(badgeText, '1', 'Cart badge should display 1 item');
    
        // Validasi item ada di keranjang
        const isItemInCart = await cartPage.isItemInCart();
        console.log(`Item ditemukan di keranjang: ${isItemInCart}`);
        assert.strictEqual(isItemInCart, true, 'Item should be present in cart');
    });

    
    afterEach(async function () {
        const screenshot = await driver.takeScreenshot();
        const filepath = `${screenshotDir}${this.currentTest.title.replace(/\s+/g, '_')}_${Date.now()}.png`;
        fs.writeFileSync(filepath, screenshot, 'base64');
    });

    after(async function () {
        await driver.quit();
    });
});