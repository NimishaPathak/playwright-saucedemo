// tests/auth/login.spec.js
import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { LoginPage } from '../../src/pages/LoginPage.js';
import { InventoryPage } from '../../src/pages/InventoryPage.js';
import { users, expectedErrors } from '../../src/utils/testData.js';

test.describe('Authentication Tests', () => {

    let loginPage;
    let inventoryPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);

        // Shared Allure metadata — written once for all tests
        await allure.suite('Authentication');
        await allure.feature('Login');

        await loginPage.goto();
    });

    // POSITIVE TESTS

    test('TC_LOGIN_001 - Standard user can login successfully @smoke @critical',
        async ({ page }) => {
            // @smoke   = include in smoke test pipeline run
            // @critical = high business impact if this fails

            await allure.story('Successful Login');

            await test.step('Login with standard user', async () => {
                await loginPage.login(users.standard.username, users.standard.password);
            });

            await test.step('Verify redirected to inventory page', async () => {
                await expect(page).toHaveURL(/inventory/);
                expect(await inventoryPage.isOnInventoryPage()).toBe(true);
            });
        });

    test('TC_LOGIN_002 - Login page has correct title @smoke',
        async ({ page }) => {
            await allure.story('Page Load');

            await test.step('Verify browser tab title is Swag Labs', async () => {
                await expect(page).toHaveTitle(/Swag Labs/);
            });
        });

    test('TC_LOGIN_003 - Login logo is visible on page load @smoke @ui',
        async () => {
            await allure.story('Page Load');

            await test.step('Verify Swag Labs logo is visible', async () => {
                expect(await loginPage.isLogoVisible()).toBe(true);
            });
        });

    test('TC_LOGIN_004 - Standard user lands on Products page @regression @critical',
        async ({ page }) => {
            await allure.story('Successful Login');

            await test.step('Login with standard user', async () => {
                await loginPage.login(users.standard.username, users.standard.password);
            });

            await test.step('Verify Products heading is visible', async () => {
                await expect(page.locator('.title')).toHaveText('Products');
            });
        });

    test('TC_LOGIN_005 - Performance glitch user can login @regression',
        async ({ page }) => {
            await allure.story('Successful Login');

            await test.step('Login with performance glitch user', async () => {
                await loginPage.login(users.performance.username, users.performance.password);
            });

            await test.step('Verify redirect within 15 seconds', async () => {
                await expect(page).toHaveURL(/inventory/, { timeout: 15000 });
            });
        });

    // NEGATIVE TESTS

    test('TC_LOGIN_006 - Locked out user sees error message @regression @negative @critical',
        async () => {
            await allure.story('Login Failures');

            await test.step('Attempt login with locked out user', async () => {
                await loginPage.login(users.locked.username, users.locked.password);
            });

            await test.step('Verify locked out error message', async () => {
                const error = await loginPage.getErrorMessage();
                expect(error).toContain(expectedErrors.lockedUser);
            });
        });

    test('TC_LOGIN_007 - Invalid credentials show error message @negative',
        async ({ page }) => {
            await allure.story('Login Failures');

            await test.step('Enter invalid username and password', async () => {
                await loginPage.login(users.invalid.username, users.invalid.password);
            });

            await test.step('Verify error visible with correct text', async () => {
                expect(await loginPage.isErrorVisible()).toBe(true);
                const error = await loginPage.getErrorMessage();
                expect(error).toContain(expectedErrors.invalidUser);
            });
        });

    test('TC_LOGIN_008 - Empty username shows validation error @negative @validation',
        async () => {
            await allure.story('Login Validations');

            await test.step('Submit form with empty username', async () => {
                await loginPage.login('', users.standard.password);
            });

            await test.step('Verify username required error', async () => {
                const error = await loginPage.getErrorMessage();
                expect(error).toContain(expectedErrors.emptyUser);
            });
        });

    test('TC_LOGIN_009 - Empty password shows validation error @negative @validation',
        async () => {
            await allure.story('Login Validations');

            await test.step('Submit form with empty password', async () => {
                await loginPage.login(users.standard.username, '');
            });

            await test.step('Verify password required error', async () => {
                const error = await loginPage.getErrorMessage();
                expect(error).toContain(expectedErrors.emptyPass);
            });
        });

    test('TC_LOGIN_010 - Both fields empty shows username error first @negative @validation',
        async () => {
            await allure.story('Login Validations');

            await test.step('Submit with both fields empty', async () => {
                await loginPage.login('', '');
            });

            await test.step('Verify username validated before password', async () => {
                const error = await loginPage.getErrorMessage();
                expect(error).toContain(expectedErrors.emptyUser);
            });
        });

    test('TC_LOGIN_011 - Error message dismissed with X button @ui',
        async () => {
            await allure.story('Login Failures');

            await test.step('Trigger error by submitting empty form', async () => {
                await loginPage.login('', '');
            });

            await test.step('Verify error is visible', async () => {
                expect(await loginPage.isErrorVisible()).toBe(true);
            });

            await test.step('Dismiss error and verify it is gone', async () => {
                await loginPage.dismissError();
                expect(await loginPage.isErrorVisible()).toBe(false);
            });
        });

    test('TC_LOGIN_012 - Wrong password shows error message @negative',
        async () => {
            await allure.story('Login Failures');

            await test.step('Enter correct username but wrong password', async () => {
                await loginPage.login(users.standard.username, 'wrongpassword123');
            });

            await test.step('Verify error shown with correct text', async () => {
                expect(await loginPage.isErrorVisible()).toBe(true);
                const error = await loginPage.getErrorMessage();
                expect(error).toContain(expectedErrors.invalidUser);
            });
        });

    test('TC_LOGIN_013 - SQL injection attempt safely handled @security @negative @critical',
        async () => {
            await allure.story('Security');

            await test.step('Enter SQL injection payload in both fields', async () => {
                await loginPage.login("' OR '1'='1", "' OR '1'='1");
            });

            await test.step('Verify login is NOT bypassed', async () => {
                expect(await loginPage.isErrorVisible()).toBe(true);
            });
        });

    test('TC_LOGIN_014 - Standard user can logout successfully @smoke @regression @critical',
        async ({ page }) => {
            await allure.story('Logout');

            await test.step('Login as standard user', async () => {
                await loginPage.login(users.standard.username, users.standard.password);
            });

            await test.step('Logout via burger menu', async () => {
                await inventoryPage.logout();
            });

            await test.step('Verify redirected back to login page', async () => {
                await expect(page).toHaveURL(/saucedemo\.com\/?$/);
                expect(await loginPage.isLogoVisible()).toBe(true);
            });
        });

    test('TC_LOGIN_015 - Back button after logout does not bypass auth @security @regression @critical',
        async ({ page }) => {
            await allure.story('Security');

            await test.step('Login then logout', async () => {
                await loginPage.login(users.standard.username, users.standard.password);
                await inventoryPage.logout();
            });

            await test.step('Press back button', async () => {
                await page.goBack();
            });

            await test.step('Verify auth not bypassed — still on login page', async () => {
                await expect(page).toHaveURL(/saucedemo\.com/);
                expect(await loginPage.isLogoVisible()).toBe(true);
            });
        });
});