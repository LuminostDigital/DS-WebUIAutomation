const { Builder, By, Key, until } = require('selenium-webdriver');
async function exampleTest() {
 // Membuat koneksi dengan Browser Driver


    let driver = await new Builder().forBrowser('chrome').build();
    //Exception handling & Conclusion
    try {
        //Buka URL di broswer
        await driver.get("https://www.google.com");

        //Mencari di search box
        let searchBox = await driver.findElement(By.name('q'));

        //Simulate user behaviour typing "Hello World"
        //note searchbox pada google, typing hello world, Return berfungsi sebagai Enter
        await searchBox.sendKeys("Hello World!", Key.RETURN);

        //10000 artinya menunggu 10000ms
        //Note: by.id adalah element, macam-macam element antara lain 
        // (id, css selector, class name, tag name, dan xpath(xpath bisa digabung dengan data))
        // xpath menggunakan query.
        await driver.wait(until.elementLocated(By.id('result-stats')), 10000);

        let title = await driver.getTitle();

        // ` ini bukan ' ini, berbeda.. gunakan ` disamping angka 1
        console.log(`Page Title is: ${title}`);
    } finally {

    }
}
//exampleTest dipanggil dari async function exampleTest di atas.
exampleTest();