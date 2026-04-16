/**
 * @typedef {import('@playwright/test').Page} Page
 * @typedef {import('@playwright/test').Locator} Locator
 */
import { BasePage } from './BasePage.js';

export class InventoryPage extends BasePage {
    /** @param {Page} page */
    constructor(page) {
        super(page);
    }

    getPageTitle() {
        return this.getByRoleLocator('heading', { name: /products/i });
    }

    getProductList() {
        return this.getByCss('.inventory_list');
    }
    getProductItems() {
        return this.getByCss('.inventory_item');
    }

    getProductNames() {
        return this.getByCss('.inventory_item_name');
    }
    getProductPrices() {
        return this.getByCss('.inventory_item_price');
    }

    getProductDescriptions() {
        return this.getByCss('.inventory_item_desc');
    }

    getSortDropdown() {
        return this.getByDataTest('product-sort-container');
    }

    getCartIcon() {
        return this.getByDataTest('shopping-cart-link');
    }
    getCartBadge() {
        return this.getByCss('.shopping_cart_badge');
    }

    getAddToCartButtons() {
        return this.page.locator('[data-test^="add-to-cart"]');
    }
    getRemoveButtons() {
        return this.page.locator('[data-test^="remove"]');
    }

    getAddToCartButtonByName(productName) {
        const slug = productName.toLowerCase().replace(/ /g, '-');
        return this.getByDataTest(`add-to-cart-${slug}`);
    }
    getRemoveButtonByName(productName) {
        const slug = productName.toLowerCase().replace(/ /g, '-');
        return this.getByDataTest(`remove-${slug}`);
    }
    getProductLinkByName(productName) {
        return this.getByRoleLocator('link', { name: productName }).first();
    }

    getBurgerMenuButton() {
        return this.getByRoleLocator('button', { name: /open menu/i });
    }
    getLogoutLink() {
        return this.getByRoleLocator('link', { name: /logout/i });
    }

    getAboutLink() {
        return this.getByRoleLocator('link', { name: /about/i });
    }

    getResetAppLink() {
        return this.getByRoleLocator('link', { name: /reset app state/i });
    }

    getCloseSidebarButton() {
        return this.getByRoleLocator('button', { name: /close menu/i });
    }

    // PAGE STATE CHECKS

    async isOnInventoryPage() {
        return await this.isLocatorVisible(this.getProductList());
    }

    async getProductCount() {
        return await this.getProductItems().count();
    }

    async getCartCount() {
        const badge = this.getCartBadge();
        if (await badge.isVisible()) {
            return parseInt(await badge.textContent());
        }
        return 0;
    }

    async getAllProductNames() {
        return await this.getProductNames().allTextContents();
    }

    async getAllProductPrices() {
        const rawPrices = await this.getProductPrices().allTextContents();
        return rawPrices.map(p => parseFloat(p.replace('$', '')));
    }

    async getAllProductDescriptions() {
        return await this.getProductDescriptions().allTextContents();
    }

    // SORT ACTIONS

    async sortBy(option) {
        // option values: 'az' | 'za' | 'lohi' | 'hilo'
        await this.getSortDropdown().selectOption(option);
    }

    async getSelectedSortOption() {
        return await this.getSortDropdown().inputValue();
    }

    // CART ACTIONS

    async addItemToCartByIndex(index = 0) {
        await this.getAddToCartButtons().nth(index).click();
    }

    async addItemToCartByName(productName) {
        await this.clickLocator(this.getAddToCartButtonByName(productName));
    }

    async removeItemFromCartByName(productName) {
        await this.clickLocator(this.getRemoveButtonByName(productName));
    }

    async addAllItemsToCart() {
        const count = await this.getAddToCartButtons().count();
        for (let i = 0; i < count; i++) {
            // Always click first() because after clicking,
            // "Add to cart" becomes "Remove" — list shrinks
            await this.getAddToCartButtons().first().click();
        }
    }

    async goToCart() {
        await this.clickLocator(this.getCartIcon());
    }

    // PRODUCT ACTIONS

    async clickProductByName(productName) {
        await this.clickLocator(this.getProductLinkByName(productName));
    }

    // BURGER MENU ACTIONS

    async openBurgerMenu() {
        await this.clickLocator(this.getBurgerMenuButton());
        await this.waitForLocator(this.getLogoutLink());
    }

    async closeBurgerMenu() {
        await this.clickLocator(this.getCloseSidebarButton());
    }

    async logout() {
        await this.openBurgerMenu();
        await this.clickLocator(this.getLogoutLink());
    }

    async resetAppState() {
        await this.openBurgerMenu();
        await this.clickLocator(this.getResetAppLink());
        await this.closeBurgerMenu();
    }
}