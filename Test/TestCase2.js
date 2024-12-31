const { Builder } = require('selenium-webdriver');
const LoginPage = require('../WebComponent/LoginPage');
const assert = require('assert');
require('dotenv').config();


const browser = process.env.BROWSER;
const baseUrl = process.env.BASE_URL;
const username = process.env.INVALID_USER_NAME;
const password = process.env.INVALID_PASSWORD;

describe('TestCase 2 [login] #Smoke', function () {
    this.timeout(40000);
    let driver;

    switch(browser.toLowerCase()) {   
        case 'firefox':
            const firefox = require('selenium-webdriver/firefox');
            options = new firefox.Options();
            options.addArguments('--headless');
        case 'edge':
            const edge = require('selenium-webdriver/edge');
            options = new edge.Options();
            options.addArguments('--headless');
        
        case 'chrome':
        default:
            const chrome = require('selenium-webdriver/chrome');
            options = new chrome.Options();
            options.addArguments('--headless');
            break;
    }

     //Run setiap mulai test, satu kali saja paling awal
     before(async function (){
        driver = await new Builder().forBrowser(browser).setChromeOptions(options).build(); //browser panggil dari .env
    });

    //Test Suite dimulai dengan apa, setiap melakukan tes
    beforeEach(async function (){
        const loginPage = new LoginPage(driver);
        await loginPage.navigate(baseUrl);          // panggil dari .env
        await loginPage.login(username, password); // panggil dari .env
    });


    //Assertion atau validasi
    it('Error message appears for invalid credentials', async function (){
        const loginPage = new LoginPage(driver);
        const errorMessage = await loginPage.getErrorMessage();
        assert.strictEqual(errorMessage, 'Epic sadface: Username and password do not match any user in this service'
            , 'Expected error message does not match')
    });

    after(async function (){
        await driver.quit();
    });
});