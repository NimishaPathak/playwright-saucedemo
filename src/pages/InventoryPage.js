// src/pages/InventoryPage.js
import { BasePage } from './BasePage.js';

export class InventoryPage extends BasePage {
    constructor(page) {
        super(page);
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

    getSortDropdown() {
        return this.getByDataTest('product_sort_container');
    }

    getCartIcon() {
        return this.page.getByRole('link', { name: /shopping cart/i });
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
    getBurgerMenuButton() {
        return this.page.getByRole('button', { name: /open menu/i });
    }

    getLogoutLink() {
        return this.page.getByRole('link', { name: /logout/i });
    }

    getAboutLink() {
        return this.page.getByRole('link', { name: /about/i });
    }

    getPageTitle() {
        return this.page.getByRole('heading', { name: /products/i });
    }

    async isOnInventoryPage() {
        return await this.isLocatorVisible(this.getProductList());
    }

    async getProductCount() {
        return await this.getProductItems().count();
    }

    async addItemToCartByIndex(index = 0) {
        await this.getAddToCartButtons().nth(index).click();
    }

    async addItemToCartByName(productName) {
        await this.clickLocator(this.getAddToCartButtonByName(productName));
    }

    async addAllItemsToCart() {
        const count = await this.getAddToCartButtons().count();
        for (let i = 0; i < count; i++) {
            await this.getAddToCartButtons().first().click();
        }
    }

    async getCartCount() {
        const badge = this.getCartBadge();
        if (await badge.isVisible()) {
            return parseInt(await badge.textContent());
        }
        return 0;
    }

    async sortBy(option) {
        // options: 'az' | 'za' | 'lohi' | 'hilo'
        await this.getSortDropdown().selectOption(option);
    }

    async getAllProductNames() {
        return await this.getProductNames().allTextContents();
    }

    async getAllProductPrices() {
        const rawPrices = await this.getProductPrices().allTextContents();
        return rawPrices.map(p => parseFloat(p.replace('$', '')));
    }

    async goToCart() {
        await this.clickLocator(this.getCartIcon());
    }

    async logout() {
        await this.clickLocator(this.getBurgerMenuButton());
        await this.waitForLocator(this.getLogoutLink());
        await this.clickLocator(this.getLogoutLink());
    }
}