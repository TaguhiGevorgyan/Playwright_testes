import { test, expect } from '@playwright/test';

test.describe('Add and delete items from basket', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.zigzag.am/am/');
  });

  test('Find the item, open and compare the price', async ({ page }) => {
    const searchBox = page.locator('input[name="q"]').first();
    await searchBox.fill('TV');
    await searchBox.press('Enter');

    const itemBox = page.locator('.product-item-details');
    const item = itemBox.filter({ hasText: 'Yandex TV Alisa 43' });

    const oldPriceLocator = item.locator('.price .promo-price-44559');
    const newPriceLocator = item.locator('.price .current_price');

    let priceText: string | null;
    if (await newPriceLocator.isVisible()) {
      priceText = await newPriceLocator.textContent();
    } else {
      priceText = await oldPriceLocator.textContent();
    }

    const numericPrice = Number(priceText?.replace(/[^\d]/g, ''));
    console.log('Extracted Price:', numericPrice);

    await item.click();

    await expect(page.locator('.value').filter({ hasText: '015750' })).toBeVisible();

    const detailNewPrice = page.locator('.price .current_price');
    const detailOldPrice = page.locator('.price .promo-old-price');

    let detailPriceText;
    if (await detailNewPrice.isVisible()) {
      detailPriceText = await detailNewPrice.textContent();
    } else {
      detailPriceText = await detailOldPrice.textContent();
    }

    const detailNumericPrice = Number(detailPriceText?.replace(/[^\d]/g, ''));
    expect(detailNumericPrice).toBe(numericPrice);
  });

  test('Add item to the basket', async ({ page }) => {
    const searchBox = page.locator('.minisearch .input-text');
    await searchBox.fill('mobile');
    await searchBox.press('Enter');

    const itemBox = page.locator('.product-item-details');
    const item = itemBox.filter({ hasText: 'Apple USB-C to Lightning Cable (2m) /MW2R3' });
    const itemName = await item.textContent();

    await item.hover();
    const addToCartButton = item.locator('.action').getByText('Ավելացնել');
    
    await addToCartButton.waitFor({ state: 'visible' });
    await addToCartButton.click();

    const basketButton = page.locator('.basket_block .basket_btn');
    await basketButton.waitFor({ state: 'visible' });
    await basketButton.click();

    const basketItem = page.locator('.mpquickcart-block .product-item-details');
    const basketItemText = await basketItem.textContent();

    expect(itemName?.trim()).toContain(basketItemText?.trim() ?? '');
  });

  test('Add item, delete it, and verify basket is empty', async ({ page }) => {
    const searchBox = page.locator('.minisearch .input-text');
    await searchBox.fill('mobile');
    await searchBox.press('Enter');

    const itemBox = page.locator('.product-item-details');
    const item = itemBox.filter({ hasText: 'Apple USB-C to Lightning Cable (2m) /MW2R3' });

    await item.hover();
    const addToCartButton = item.locator('.action').getByText('Ավելացնել');
    await addToCartButton.waitFor({ state: 'visible' });
    await addToCartButton.click();

    const basketButton = page.locator('.basket_block .basket_btn');
    await basketButton.click();

    const deleteButton = page.locator('.mpquickcart-block .delete');
    await deleteButton.click();

    const confirmButton = page.locator('.modal-inner-wrap .action-accept');
    await confirmButton.click();

    const emptyBasketMessage = page.locator('.empty');
    await expect(emptyBasketMessage).toBeVisible();
  });
});
