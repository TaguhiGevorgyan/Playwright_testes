import { test, expect } from '@playwright/test';

test('Find the item, open and compare the price', async ({ page }) => {
    await page.goto('https://www.zigzag.am/am/');

    const searchBox = page.locator('input[name = "q"]').first();

    await searchBox.fill('TV');

    await searchBox.press('Enter');

    const itemBox = page.locator('.product-item-details');

    const item = itemBox.filter({ hasText: 'Yandex TV Alisa 43' });

    const itemPrice = item.locator('.price').nth(1).textContent();

    await item.first().click();

    await expect(page.locator('.value').filter({ hasText: '015750' })).toBeVisible();

    const price = page.locator('.price').nth(1).textContent();

    expect(itemPrice === price);
})