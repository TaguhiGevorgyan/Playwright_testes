import { test, expect } from '@playwright/test';

test.describe('Add and delete items from basket', () => {
    //1․ Մուտք գործել "zigzag am"
    test.beforeEach(async ({ page }) => {
        await page.goto('https://www.zigzag.am/am/');
    });
    test('Add products and checkout', async ({ page }) => {

        //2. Անցնել "ըստ ցանկության" tab

        await page.getByRole('link', { name: 'Հեռուստացույցներ, աուդիո և վիդեոտեխնիկա' }).hover();
        await expect.soft(page.getByRole('listitem').filter({ hasText: 'Հեռուստացույցներ, աուդիո և վիդեոտեխնիկաՀեռուստացույցներ, աուդիո և վիդեոտեխնիկա' }).getByRole('link')).toHaveCSS('color', 'rgb(255, 0, 0)');
        await page.getByRole('link', { name: 'Պրոյեկտորներ', exact: true }).click();
        await expect.soft(page.locator('.filter-option-inner-inner')).toBeVisible();

        // 3. Ընտրել որևէ ապրանք

        const item = await page.locator('.product-item-details').nth(1);

        //4․ Վերագրել փոփոխականներին ապրանքի գումարը

        const itemPrice = await item.locator('.price').innerText();
        console.log('giny', itemPrice);

        //5․ Կատարել Ավելացնել գործողությունը  

        await expect(item).toBeVisible();
        await item.hover();
        const addToCartButton = item.locator('.add_to_cart');
        await addToCartButton.click();
        expect.soft(addToCartButton).toBeDefined();

        //6. Ստուգել որ ավելացել է զամբյուզում

        const basketModal = page.locator(".mpquickcart-block");
        await expect(basketModal).toBeVisible();

        //7․ Ստուգել զամբյուզում ապրանքի գումարը  (Soft Assertion)

        const itemBasketPrice = await page.locator('.price-excluding-tax').textContent();
        console.log('giny', itemBasketPrice);
        await page.locator('.modals-overlay').click();

        //8․ Անցնել ուրիշ "ըստ ցանկության" tab

        await page.getByRole('link', { name: 'Խոհանոցային տեխնիկա' }).click();

        //9․ Ընտրել որևէ ապրանք

        const item2 = page.locator('.product-item-details').filter({ hasText: 'Teka HSB 630 BLACK' });

        //10.Վերագրել փոփոխականի ապրանքի գումարը

        const item2Price = await item2.locator('.price').textContent();
        await item2.hover();
        await item2.locator('.add_to_cart').click();
        console.log('2giny', item2Price);

        //11.Ստուգել որ ավելացել է զամբյուղում (Soft Assertion)

        await expect(basketModal).toBeVisible();
        const item2BasketPrice = await page.locator('.price-excluding-tax').first().textContent();
        console.log('2giny', item2BasketPrice);
        const item2Name = await basketModal.locator('.product-item-name').first().textContent();
        const itemName = await basketModal.locator('.product-item-name').nth(1).textContent();
        console.log('item1', itemName);
        console.log('item2', item2Name);

        //12.Ստուգել զամբյուզում երկու ապրանքների անունները և գումարները և ընդհանուր գումարը (Soft Assertion)

        expect.soft(item2Name).toContain('Teka HSB 630 BLACK');
        expect.soft(itemName).toContain('Epson CO-FD01 Full HD Projector /V11HA84240');
        expect.soft(item2BasketPrice?.trim()).toContain(' 349,000 ֏');
        expect.soft(itemBasketPrice?.trim()).toContain('279,900 ֏');
        const itemsTotalPrice = await basketModal.locator('.totals').filter({ hasText: 'ընդհանուր' }).textContent();

        function parsePrice(text) {
            return parseFloat(text.replace(/[^0-9.]/g, ''));
        }

        const numItemBasketPrice = parsePrice(itemBasketPrice);
        const numItem2BasketPrice = parsePrice(item2BasketPrice);
        const numItemsTotalPrice = parsePrice(itemsTotalPrice);

        console.log('arajin', numItem2BasketPrice);
        console.log('erkrord', numItemBasketPrice);
        console.log('verjnakan', numItemsTotalPrice);
         expect.soft(numItemsTotalPrice).toEqual(numItemBasketPrice + numItem2BasketPrice);

        //10. Կատարել Պատվիրել գործողությունը

        await page.locator('#top-cart-btn-checkout').click();
       // const orderCard = page.locator('#checkout-review-table');
        //await expect.soft(orderCard).toBeVisible();
        //const itemNameLast = await orderCard.locator('.product-item-name-block').first().textContent();
        //const item2NameLast = await orderCard.locator('.product-item-name-block').nth(1).textContent();
        //expect.soft(itemNameLast).toContain('Epson CO-FD01 Full HD Projector /V11HA84240');
        //expect.soft(item2NameLast).toContain('Teka HSB 630 BLACK');
        //const itemsTotalPriceCheck = await page.locator('.grand.totals .price').textContent();
        //const numItemsTotalPriceCheck = parsePrice(itemsTotalPriceCheck);
        //expect(numItemsTotalPriceCheck).toEqual(numItemsTotalPrice);

        //11․ Լրացնել "Առաքման հասցե" -ի բոլոր դաշտերը

        //await page.waitForTimeout(5000);
        
        const emailField = page.locator('#customer-email').first();
        await emailField.fill('gevorgyantaguhi12.11@gmail.com');
        await expect.soft(emailField).toBeVisible();
        const deliveryCard = page.locator('#shipping-new-address-form');
        const firstName = deliveryCard.locator('input[name="firstname"]');
        await firstName.fill('Taguhi');
        await expect.soft(firstName).toBeVisible();
        const lastName = deliveryCard.locator('input[name="lastname"]');
        await lastName.fill('lastname');
        await expect.soft(lastName).toBeVisible();
        const province = deliveryCard.locator('select').filter({ hasText: 'Խնդրում ենք ընտրել մարզ' });
        await province.selectOption({ label: 'Երևան' });
        await expect.soft(province).toBeVisible();
        const address = deliveryCard.locator('input[name="street[0]"]');
        await address.fill('Մ.Մելքոնյան');
        await expect.soft(address).toBeVisible();
        const telephon = deliveryCard.getByTestId('telephone_fake');
        await telephon.fill('93135125')
        await expect.soft(telephon).toBeVisible();
        const birthdateDay = deliveryCard.locator('.filter-option-inner-inner').filter({ hasText: 'Օր' });
        await birthdateDay.click();
        await page.locator('li:has-text("12")').click();
        await expect.soft(birthdateDay).toBeVisible();
        const birthdateMonth = deliveryCard.locator('.filter-option-inner-inner').filter({ hasText: 'Ամիս' });
        await birthdateMonth.click();
        await page.locator('li:has-text("նոյեմբեր")').click();
        await expect.soft(birthdateMonth).toBeVisible();
        const birthdateYear = deliveryCard.locator('.filter-option-inner-inner').filter({ hasText: 'տարի' });
        await birthdateYear.click();
        await page.locator('li:has-text("1993")').click();
        await expect.soft(birthdateYear).toBeVisible();
        const standart = deliveryCard.getByLabel('Ստանդարտ առաքում');
        await standart.check();
        await expect.soft(standart).toBeChecked();
    })


    test('Price sorting test', async ({ page }) => {
        //1. Search the item
        const searchBox = page.locator('#search');
        await searchBox.fill('iphone 16');
        await searchBox.press('Enter');
        //2.Check if search result is visible
        const header = page.getByText('Search results for "iphone 16"');
        await expect(header).toBeVisible();
        //3.Sort the page 
        const filterButton = page.locator('.filter-option-inner-inner');
        await filterButton.click();
        await page.click('text=Գնի նվազման');
        //4.Take all current prices
        const priceLocator = page.locator('span.current_price');
        //5 wait untile the first elemnet will be visible
        await expect(priceLocator.first()).toBeVisible({ timeout: 10000 });
        //6.All elements count
        const count = await priceLocator.count();
        //7.Loop into all elements and take all elements' prices
        let arr: number[] = [];
        for (let i = 0; i < count; i++) {
          const singlePrice = priceLocator.nth(i);
          const text = await singlePrice.innerText();
          const numPrice = parseFloat(text.replace(/[^\d.]/g, '').replace(/,/g, ''));
          arr.push(numPrice);
          }
        //8.Compare elements with each other
        for(let i = 0; i < count-1; i++){
            expect(arr[i] >= arr[i+1]);
        }
})

test('Search functionality', async ({page})=>{
    //Search the item
    const searchBox = page.locator('#search');
    await searchBox.fill('Samsung');
    await searchBox.press('Enter');
    //Check if the correct page is opened
    const headerText = page.locator('.span.base');
    expect.soft(headerText).toHaveText('Search results for "Samsung"');
    //take all items' names
    const nameLocator = page.locator('.product_name');
    //wait untill the first item name will appear
    await expect(nameLocator.first()).toBeVisible({ timeout: 10000 });
    //count of items in the first page
    const count = await nameLocator.count();
    //check if all elements contain "Samsung" in their names
    for(let i =0; i < count; i++){
        const item = nameLocator.nth(i);
        const itemName = await item.textContent();
        console.log(itemName);
        expect.soft(itemName?.toLowerCase()).toContain("samsung");
    }
})
})