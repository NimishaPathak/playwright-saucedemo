// tests/inventory/inventory.spec.js
import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { LoginPage } from '../../src/pages/LoginPage.js';
import { InventoryPage } from '../../src/pages/InventoryPage.js';
import { users, sortOptions, products, productPrices } from '../../src/utils/testData.js';

/** @type {LoginPage} */ let loginPage;
/** @type {InventoryPage} */ let inventoryPage;

test.describe('🛒 Inventory Tests', () => {

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);

        // Shared Allure metadata
        await allure.suite('Products');
        await allure.feature('Product Catalog');

        // Navigate directly to inventory (auth state is handled by config)
        await page.goto('/inventory.html');
        await expect(page).toHaveURL(/inventory.html/);
    });

    // PAGE LOAD TESTS

    test('TC_INV_001 - Inventory page loads successfully @smoke @critical',
        async ({ page }) => {
            await allure.story('Page Load');

            await test.step('Verify inventory page is displayed', async () => {
                expect(await inventoryPage.isOnInventoryPage()).toBe(true);
            });

            await test.step('Verify page title is Products', async () => {
                await expect(page.locator('.title')).toHaveText('Products');
            });
        });


    test('TC_INV_002 - Inventory page displays exactly 6 products @smoke @regression',
        async () => {
            await allure.story('Page Load');

            await test.step('Count total products on page', async () => {
                const count = await inventoryPage.getProductCount();
                expect(count).toBe(6);
            });
        });

    test('TC_INV_003 - All product names are visible @regression',
        async () => {
            await allure.story('Page Load');

            await test.step('Get all product names', async () => {
                const names = await inventoryPage.getAllProductNames();
                expect(names).toHaveLength(6);
            });

            await test.step('Verify each expected product is present', async () => {
                const names = await inventoryPage.getAllProductNames();
                expect(names).toContain(products.backpack);
                expect(names).toContain(products.bikeLight);
                expect(names).toContain(products.boltShirt);
                expect(names).toContain(products.fleeceJacket);
                expect(names).toContain(products.onesie);
                expect(names).toContain(products.redShirt);
            });
        });

    test('TC_INV_004 - All products have prices displayed @regression',
        async () => {
            await allure.story('Page Load');

            await test.step('Get all product prices', async () => {
                const prices = await inventoryPage.getAllProductPrices();
                expect(prices).toHaveLength(6);
            });

            await test.step('Verify all prices are positive numbers', async () => {
                const prices = await inventoryPage.getAllProductPrices();
                prices.forEach(price => {
                    expect(price).toBeGreaterThan(0);
                });
            });
        });

    test('TC_INV_005 - All products have Add to Cart buttons @smoke @regression',
        async () => {
            await allure.story('Page Load');

            await test.step('Verify 6 Add to Cart buttons visible', async () => {
                const count = await inventoryPage.getAddToCartButtons().count();
                expect(count).toBe(6);
            });
        });

    // SORT TESTS

    test('TC_INV_006 - Products sort A to Z correctly @regression',
        async () => {
            await allure.story('Sort Functionality');

            await test.step('Select A to Z sort option', async () => {
                await inventoryPage.sortBy(sortOptions.AtoZ);
            });

            await test.step('Verify products are in A-Z order', async () => {
                const names = await inventoryPage.getAllProductNames();
                const sorted = [...names].sort();
                expect(names).toEqual(sorted);
            });
        });

    test('TC_INV_007 - Products sort Z to A correctly @regression',
        async () => {
            await allure.story('Sort Functionality');

            await test.step('Select Z to A sort option', async () => {
                await inventoryPage.sortBy(sortOptions.ZtoA);
            });

            await test.step('Verify products are in Z-A order', async () => {
                const names = await inventoryPage.getAllProductNames();
                const sorted = [...names].sort().reverse();
                expect(names).toEqual(sorted);
            });
        });

    test('TC_INV_008 - Products sort Low to High price correctly @regression',
        async () => {
            await allure.story('Sort Functionality');

            await test.step('Select Low to High sort option', async () => {
                await inventoryPage.sortBy(sortOptions.LowToHigh);
            });

            await test.step('Verify prices are in ascending order', async () => {
                const prices = await inventoryPage.getAllProductPrices();
                const sorted = [...prices].sort((a, b) => a - b);
                expect(prices).toEqual(sorted);
            });
        });

    test('TC_INV_009 - Products sort High to Low price correctly @regression',
        async () => {
            await allure.story('Sort Functionality');

            await test.step('Select High to Low sort option', async () => {
                await inventoryPage.sortBy(sortOptions.HighToLow);
            });

            await test.step('Verify prices are in descending order', async () => {
                const prices = await inventoryPage.getAllProductPrices();
                const sorted = [...prices].sort((a, b) => b - a);
                expect(prices).toEqual(sorted);
            });
        });

    test('TC_INV_010 - Default sort is A to Z @regression',
        async () => {
            await allure.story('Sort Functionality');

            await test.step('Verify default sort option is az', async () => {
                const selected = await inventoryPage.getSelectedSortOption();
                expect(selected).toBe(sortOptions.AtoZ);
            });
        });

    // CART TESTS

    test('TC_INV_011 - Add single item to cart updates badge @smoke @critical',
        async () => {
            await allure.story('Add to Cart');

            await test.step('Add Sauce Labs Backpack to cart', async () => {
                await inventoryPage.addItemToCartByName(products.backpack);
            });

            await test.step('Verify cart badge shows 1', async () => {
                const count = await inventoryPage.getCartCount();
                expect(count).toBe(1);
            });
        });

    test('TC_INV_012 - Add multiple items updates cart count correctly @regression @critical',
        async () => {
            await allure.story('Add to Cart');

            await test.step('Add 3 items to cart', async () => {
                await inventoryPage.addItemToCartByName(products.backpack);
                await inventoryPage.addItemToCartByName(products.bikeLight);
                await inventoryPage.addItemToCartByName(products.boltShirt);
            });

            await test.step('Verify cart badge shows 3', async () => {
                const count = await inventoryPage.getCartCount();
                expect(count).toBe(3);
            });
        });

    test('TC_INV_013 - Add all 6 items to cart @regression',
        async () => {
            await allure.story('Add to Cart');

            await test.step('Add all items to cart', async () => {
                await inventoryPage.addAllItemsToCart();
            });

            await test.step('Verify cart badge shows 6', async () => {
                const count = await inventoryPage.getCartCount();
                expect(count).toBe(6);
            });
        });

    test('TC_INV_014 - Add to Cart button changes to Remove after adding @regression',
        async () => {
            await allure.story('Add to Cart');

            await test.step('Add backpack to cart', async () => {
                await inventoryPage.addItemToCartByName(products.backpack);
            });

            await test.step('Verify Remove button is now visible', async () => {
                const removeBtn = inventoryPage.getRemoveButtonByName(products.backpack);
                expect(await inventoryPage.isLocatorVisible(removeBtn)).toBe(true);
            });
        });

    test('TC_INV_015 - Remove item from cart decreases badge count @regression @critical',
        async () => {
            await allure.story('Remove from Cart');

            await test.step('Add 2 items to cart', async () => {
                await inventoryPage.addItemToCartByName(products.backpack);
                await inventoryPage.addItemToCartByName(products.bikeLight);
            });

            await test.step('Verify cart shows 2', async () => {
                expect(await inventoryPage.getCartCount()).toBe(2);
            });

            await test.step('Remove backpack from cart', async () => {
                await inventoryPage.removeItemFromCartByName(products.backpack);
            });

            await test.step('Verify cart badge now shows 1', async () => {
                expect(await inventoryPage.getCartCount()).toBe(1);
            });
        });

    test('TC_INV_016 - Remove all items clears cart badge @regression',
        async () => {
            await allure.story('Remove from Cart');

            await test.step('Add backpack to cart', async () => {
                await inventoryPage.addItemToCartByName(products.backpack);
            });

            await test.step('Remove backpack from cart', async () => {
                await inventoryPage.removeItemFromCartByName(products.backpack);
            });

            await test.step('Verify cart badge is gone', async () => {
                const count = await inventoryPage.getCartCount();
                expect(count).toBe(0);
            });
        });

    // NAVIGATION TESTS

    test('TC_INV_017 - Click product name navigates to product detail @regression',
        async ({ page }) => {
            await allure.story('Navigation');

            await test.step('Click on Sauce Labs Backpack', async () => {
                await inventoryPage.clickProductByName(products.backpack);
            });

            await test.step('Verify navigated to product detail page', async () => {
                await expect(page).toHaveURL(/inventory-item/);
            });
        });

    test('TC_INV_018 - Cart icon navigates to cart page @smoke @regression',
        async ({ page }) => {
            await allure.story('Navigation');

            await test.step('Click cart icon', async () => {
                await inventoryPage.goToCart();
            });

            await test.step('Verify navigated to cart page', async () => {
                await expect(page).toHaveURL(/cart/);
            });
        });

    test('TC_INV_019 - Burger menu opens successfully @regression',
        async () => {
            await allure.story('Navigation');

            await test.step('Open burger menu', async () => {
                await inventoryPage.openBurgerMenu();
            });

            await test.step('Verify logout link is visible', async () => {
                expect(
                    await inventoryPage.isLocatorVisible(inventoryPage.getLogoutLink())
                ).toBe(true);
            });
        });

    test('TC_INV_020 - Burger menu closes successfully @regression',
        async () => {
            await allure.story('Navigation');

            await test.step('Open burger menu', async () => {
                await inventoryPage.openBurgerMenu();
            });

            await test.step('Close burger menu', async () => {
                await inventoryPage.closeBurgerMenu();
            });

            await test.step('Verify logout link is no longer visible', async () => {
                await expect(inventoryPage.getLogoutLink()).toBeHidden();
            });
        });

    // RESET & PERSISTENCE TESTS

    test('TC_INV_021 - Reset app state clears cart @regression',
        async () => {
            await allure.story('Reset Functionality');

            await test.step('Add items to cart', async () => {
                await inventoryPage.addItemToCartByName(products.backpack);
                await inventoryPage.addItemToCartByName(products.bikeLight);
                expect(await inventoryPage.getCartCount()).toBe(2);
            });

            await test.step('Reset app state via burger menu', async () => {
                await inventoryPage.resetAppState();
            });

            await test.step('Verify cart is empty after reset', async () => {
                const count = await inventoryPage.getCartCount();
                expect(count).toBe(0);
            });
        });

    test('TC_INV_022 - Cart persists after page refresh @regression',
        async ({ page }) => {
            await allure.story('Cart Persistence');

            await test.step('Add backpack to cart', async () => {
                await inventoryPage.addItemToCartByName(products.backpack);
                expect(await inventoryPage.getCartCount()).toBe(1);
            });

            await test.step('Refresh the page', async () => {
                await page.reload();
            });

            await test.step('Verify cart still shows 1 after refresh', async () => {
                const count = await inventoryPage.getCartCount();
                expect(count).toBe(1);
            });
        });

    // DIFFERENT USER TESTS

    test('TC_INV_023 - Problem user can see inventory page @regression',
        async ({ page }) => {
            await allure.story('User Types');

            await test.step('Logout standard user', async () => {
                await inventoryPage.logout();
            });

            await test.step('Login as problem user', async () => {
                await loginPage.login(users.problem.username, users.problem.password);
            });

            await test.step('Verify inventory page loads', async () => {
                await expect(page).toHaveURL(/inventory/);
                expect(await inventoryPage.isOnInventoryPage()).toBe(true);
            });
        });

    test('TC_INV_024 - Performance glitch user inventory loads @regression',
        async ({ page }) => {
            await allure.story('User Types');

            await test.step('Logout standard user', async () => {
                await inventoryPage.logout();
            });

            await test.step('Login as performance glitch user', async () => {
                await loginPage.login(users.performance.username, users.performance.password);
            });

            await test.step('Verify inventory page loads within 15 seconds', async () => {
                await expect(page).toHaveURL(/inventory/, { timeout: 15000 });
                expect(await inventoryPage.isOnInventoryPage()).toBe(true);
            });
        });

    test('TC_INV_025 - Cart count not visible when cart is empty @regression',
        async () => {
            await allure.story('Add to Cart');

            await test.step('Verify cart badge is not visible on fresh login', async () => {
                const count = await inventoryPage.getCartCount();
                expect(count).toBe(0);
            });
        });

});