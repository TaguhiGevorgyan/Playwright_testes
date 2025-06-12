import { test, expect } from '@playwright/test';

test.describe('assertions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.zigzag.am/am/');
  });
  test('check basket functionality', async ({ page }) => {
    //await page.locator('.submenu_btn').locator('menu_7').getByTestId('category-node-101').hover();
    await page.getByRole('link', { name: 'Հեռուստացույցներ, աուդիո և վիդեոտեխնիկա' }).hover();
    await expect.soft(page.getByRole('link', { name: 'Հեռուստացույցներ, աուդիո և վիդեոտեխնիկա' })).toHaveCSS('color', 'rgb(255, 0, 0)');
    await page.getByRole('link', { name: 'Պրոյեկտորներ', exact: true }).click();

    await expect.soft(page.locator('.filter-option-inner-inner')).toBeVisible();

    const item = await page.locator('.product-item-details').nth(1);

    await expect(item).toBeVisible();
    await item.hover();

    const addToCartButton = item.getByRole('button', { name: 'Ավելացնել', exact: true });

    await expect.soft(addToCartButton).toHaveId('id');
    await expect.soft(addToCartButton).toBeDefined();

    const itemName = await item.locator('.info_block').textContent();
    const itemPrice = await item.locator('.price').textContent();

    expect.soft(item).toHaveText('Epson CO-FD01 Full HD Projector /V11HA84240');
    expect.soft(item).toHaveValue('279,900 ֏');

    console.log('giny', itemPrice);
    console.log('anuny', itemName);

    addToCartButton.click();

    const itemDetaillName = await page.locator('.mpquickcart-block').locator('.product-item-details').locator('.product-item-name').textContent();
    const itemDetailPrice = await page.locator('.price-excluding-tax').textContent();

    console.log('giny', itemDetailPrice);
    console.log('anuny', itemDetaillName);

    //await expect(itemDetaillName.toEqual(itemName));
  })
})