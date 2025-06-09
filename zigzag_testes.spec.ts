import { test, expect } from '@playwright/test';
test.describe('Add,delate items from basket.', () => {

    test.beforeEach(async ({ page }) => {

        await page.goto('https://www.zigzag.am/am/')
    });


test('Find the item, open and compare the price', async ({ page }) => {
    await page.goto('https://www.zigzag.am/am/');

    const searchBox = page.locator('input[name = "q"]').first();

    await searchBox.fill('TV');

    await searchBox.press('Enter');

    const itemBox = page.locator('.product-item-details');

    const item = itemBox.filter({ hasText: 'Yandex TV Alisa 43' });

    const itemOldPriceLocator = item.locator('.price').locator('.promo-price-44559');

    let itemNewPrice = item.locator('.price').locator('.current_price');

    if(await itemNewPrice.isVisible()){
        let itemNewPriceText = await itemNewPrice.textContent();

        itemNewPriceText = Number(itemNewPriceText?.replace(/[^\d.]/g, '').replace(',', ''));
    }else{
        let itemOldPriceText = itemOldPriceLocator.textContent();
        itemOldPriceText = Number(itemOldPriceText?.replace(/[^\d.]/g, '').replace(',', ''));
    }

    await item.click();

    await expect(page.locator('.value').filter({ hasText: '015750' })).toBeVisible();

    const OldPrice = page.locator('.price').locator('.promo-old-price ').textContent();

    const newPrice = page.locator('.price').locator('.current_price').textContent();

    expect(itemPrice === price);

//     const addToCartButton = page.locator('.action').getByText('Ավելացնել');
//     await addToCartButton.click();
//     const basketButton = page.locator('.basket_block').locator('.basket_btn');
//     await basketButton.waitFor({ state: 'visible' });
//     await basketButton.click();
})

test('Add item to the basket', async ({ page }) => {
    const searchBox = page.locator('.minisearch').locator('.input-text')
    await searchBox.fill('mobile');
    await searchBox.press('Enter');
    const itemBox = page.locator('.product-item-details');
    const item = itemBox.filter({ hasText: 'Apple USB-C to Lightning Cable (2m) /MW2R3' });
    const itemName = await item.textContent();
    await item.hover();
    const addToCartButton = item.locator('.action').getByText('Ավելացնել');
    await addToCartButton.waitFor({ state: 'visible' });
    await addToCartButton.click();
    const basketButton = page.locator('.basket_block').locator('.basket_btn');
    await basketButton.waitFor({ state: 'visible' });
    await basketButton.click();
    const basketItem = page.locator('.mpquickcart-block .product-item-details'); 
    const itemNameInBasket = (await basketItem.textContent())
    expect(itemName).toContain(itemNameInBasket);

    console.log('itemName', itemName);
    console.log('myusy', itemNameInBasket)
    })

    test('Add item to the basket, then delete it and check the quantity.', async ({page})=>{
        const searchBox = page.locator('.minisearch').locator('.input-text')
        await searchBox.fill('mobile');
        await searchBox.press('Enter');
        const itemBox = page.locator('.product-item-details');
        const item = itemBox.filter({ hasText: 'Apple USB-C to Lightning Cable (2m) /MW2R3' });
        await item.hover();
        const addToCartButton = item.locator('.action').getByText('Ավելացնել');
        await addToCartButton.waitFor({ state: 'visible' });
        await addToCartButton.click();
        await page.locator('.basket_block').locator('.basket_btn').click();
        await page.locator('.mpquickcart-block').locator('.delete').click();
        await page.locator('.modal-inner-wrap').locator('.action-accept').click();
        expect(page.locator('.empty').isVisible())
    })
})


