import * as dotenv from 'dotenv';
dotenv.config();

import { test, expect } from '@playwright/test';

test.describe('Login page tests', () => {

    test.beforeEach(async ({ page }) => {

        await page.goto('http://playground.testingart.com')
    });

    test('Login page with valid username and password', async ({ page }) => {

        const email = process.env.EMAIL!;

        const pass = process.env.PASS!;

        await page.getByRole('textbox', { name: 'Email Address' }).fill(email);

        await page.getByRole('textbox', { name: 'Password' }).fill(pass);

        await page.getByRole('button', { name: 'Sign In' }).click();

        await expect(page.getByRole('heading', { name: 'Welcome to Automation Testing' })).toBeVisible();

    })

    test('Login with empty fields', async ({ page }) => {

        await page.getByRole('button', { name: 'Sign In' }).click();

        await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

        await expect(page.getByText('Invalid Email or Password')).toBeVisible();
    })

    test('Login with valid username and invalid password', async ({ page }) => {

        await page.getByRole('textbox', { name: 'Email Address' }).fill('testingart@email.com');

        await page.getByRole('button', { name: 'Sign In' }).click();

        await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

        await expect(page.getByText('Invalid Email or Password')).toBeVisible();
    })

    test('Login with empty username and valid password', async ({ page }) => {

        await page.getByRole('textbox', { name: 'Password' }).fill('Testing!123');

        await page.getByRole('button', { name: 'Sign In' }).click();

        await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

        await expect(page.getByText('Invalid Email or Password')).toBeVisible();

    })

    test('Login with uncomplate username and invalid password', async ({ page }) => {

        await page.getByRole('textbox', { name: 'Email Address' }).fill('testingart');

        await page.getByRole('textbox', { name: 'Password' }).fill('test');

        await page.getByRole('button', { name: 'Sign In' }).click();

        await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

        await expect(page.getByText('Invalid Email or Password')).toBeVisible();
    })

    test('Login with deleted user', async ({ page }) => {
        await page.getByRole('textbox', { name: 'Email Address' }).fill('deletedUserEmail');

        await page.getByRole('textbox', { name: 'Password' }).fill('deletedUserPassword');

        await page.getByRole('button', { name: 'Sign In' }).click();

        await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

        await expect(page.getByText('Invalid Email or Password')).toBeVisible();

    })
});