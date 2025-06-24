import { test, expect } from '@playwright/test';

test.describe('Price Sorting, Search Functionality ', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.zigzag.am/am/');
  });
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
    for (let i = 0; i < count - 1; i++) {
      expect(arr[i] >= arr[i + 1]);
      console.log(' bababa', arr[i]);
    }
  })
  test('Search functionality', async ({ page }) => {
  //Search the item
    const searchBox = page.locator('#search');
    await searchBox.fill('Samsung');
    await searchBox.press('Enter');
  //Check if the correct page is opened
    const headerText = page.locator('.span.base');
    expect.soft(headerText).toHaveText('Search results for "Samsung"');
  //take all items' names and prices
    const nameLocator = page.locator('.product_name');
    const priceLocator = page.locator('span.price');
  //wait untill the first item's name and price will appear
    await expect(nameLocator.first()).toBeVisible({ timeout: 10000 });
    await expect(priceLocator.first()).toBeVisible({ timeout: 1000 });
  //count of items in the first page
    const count = await nameLocator.count();
  //check if all elements contain "Samsung" in their names
    for (let i = 0; i < count; i++) {
      const item = nameLocator.nth(i);
      const price = priceLocator.nth(i);
      const itemName = await item.textContent();
      const itemPrice = await price.textContent();
      console.log(itemName, ' ', itemPrice);
      expect.soft(itemName?.toLowerCase()).toContain("samsung");
    }
  })
  //invalid search
  test('Invalid search', async ({ page }) => {
    const searchBox = page.locator('#search');
    await searchBox.fill('test');
    await searchBox.press('Enter');
    //check notice message appearnce
    await page.waitForSelector('.message.notice', { state: 'visible' });
    const noticeMessageCard = page.locator('.message.notice');
    await expect(noticeMessageCard).toBeVisible();
  })
});
