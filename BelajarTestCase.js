const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

async function sauceDemoTest() {
  const driver = await new Builder().forBrowser('chrome').build();
  try {


    // 1. Login Functionality Test
    await driver.get('https://www.saucedemo.com/');
    await driver.findElement(By.id('user-name')).sendKeys('standard_user');
    await driver.findElement(By.id('password')).sendKeys('secret_sauce');
    await driver.findElement(By.id('login-button')).click();

    // Verify that the title is "Swag Labs"
    const title = await driver.getTitle();
    assert.strictEqual(title, 'Swag Labs', 'Title should be Swag Labs');





    // 2. Dashboard Menu Test
    const burgerMenu = await driver.findElement(By.id('react-burger-menu-btn'));
    assert.ok(await burgerMenu.isDisplayed(), 'Burger menu should be visible');
    await burgerMenu.click();

    // Verify that the sorting menu exists
    const sortMenu = await driver.findElement(By.className('product_sort_container'));
    assert.ok(await sortMenu.isDisplayed(), 'Sort menu should be visible');

    // Verify that the cart icon exists
    const cartButton = await driver.findElement(By.className('shopping_cart_link'));
    assert.ok(await cartButton.isDisplayed(), 'Cart button should be visible');




    
    // 3. Verify Cart is Empty Initially
    const cartBadge = await driver.findElements(By.className('shopping_cart_badge'));
    let cartCount = cartBadge.length > 0 ? await cartBadge[0].getText() : '0';          // getText walaupun angka 0,1,2,3 ditampilkan sebagai text (string) 
    // ? = tenary (if else condition),                                                  // <span class="shopping_cart_badge">3</span>
    // cocok untuk ekspresi sederhana 1 kondisi dengan 2 hasil     
                                               
    //let cartCount;
    //if (cartBadge.lenght > 0){
    // cartCount = await cartBadge[0].getText();
    //      } else {
    //          cartCount = '0';
    //  }

    assert.strictEqual(cartCount, '0', 'Cart should be empty initially');




    // 4. Add Items to Cart Test
    const addToCartButtons = await driver.findElements(By.className('btn_inventory'));
    await addToCartButtons[0].click(); // Add first item to cart                             (loop, index start from 0)

    const updatedCartBadge = await driver.findElement(By.className('shopping_cart_badge')); //REMINDER!!! shopping_cart_badge muncul di inspect
    let updatedCartCount = await updatedCartBadge.getText();                                //ketika melakukan "add to cart"
    assert.strictEqual(updatedCartCount, '1', 'Cart should contain 1 item');

    // Add second item to cart
    await addToCartButtons[1].click();
    updatedCartCount = await updatedCartBadge.getText();
    assert.strictEqual(updatedCartCount, '2', 'Cart should contain 2 items');

    // Add more items and verify
    await addToCartButtons[2].click();
    updatedCartCount = await updatedCartBadge.getText();
    assert.strictEqual(updatedCartCount, '3', 'Cart should contain 3 items');

    await addToCartButtons[3].click();
    updatedCartCount = await updatedCartBadge.getText();
    assert.strictEqual(updatedCartCount, '4', 'Cart should contain 4 items');

    await addToCartButtons[4].click();
    updatedCartCount = await updatedCartBadge.getText();
    assert.strictEqual(updatedCartCount, '5', 'Cart should contain 5 items');

    await addToCartButtons[5].click();
    updatedCartCount = await updatedCartBadge.getText();
    assert.strictEqual(updatedCartCount, '6', 'Cart should contain 6 items');




    // 5. Proceed to Checkout
    await driver.findElement(By.className('shopping_cart_link')).click();
    await driver.findElement(By.id('checkout')).click();




    // 6. Checkout Form Test
    await driver.findElement(By.id('first-name')).sendKeys('Michael');
    await driver.findElement(By.id('last-name')).sendKeys('Andrew');
    await driver.findElement(By.id('postal-code')).sendKeys('89898');
    await driver.findElement(By.id('continue')).click();

    // Ensure the overview page displays correctly
    const overviewTitle = await driver.findElement(By.xpath("//span[@class='title']")).getText();
    assert.strictEqual(overviewTitle, 'Checkout: Overview', 'Overview page should be displayed');




    // 7. Finish Checkout Test
    await driver.findElement(By.id('finish')).click();




    // 8. Thank You Page and Redirect Back to Products
    const thankYouMessage = await driver.findElement(By.className('complete-header')).getText();
    assert.strictEqual(thankYouMessage, 'Thank you for your order!', 'Thank you message should be shown');
    await driver.findElement(By.id('back-to-products')).click();

    // Verify we are back on the homepage
    const homePageTitle = await driver.getTitle();
    assert.strictEqual(homePageTitle, 'Swag Labs', 'We should be back on the homepage');




    // 9. Verify All Buttons and UI Elements
    const allButtons = await driver.findElements(By.css('button'));
    assert.ok(allButtons.length > 0, 'Buttons should be available on the page');
    
    // Verify Image items are displayed
    const imageItems = await driver.findElements(By.className('inventory_item_img'));
    assert.ok(imageItems.length > 0, 'Product images should be displayed');


  } finally {
    await driver.quit();
  }
}

sauceDemoTest();
