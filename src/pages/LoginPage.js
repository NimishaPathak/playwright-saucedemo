/**
 * @typedef {import('@playwright/test').Page} Page
 * @typedef {import('@playwright/test').Locator} Locator
 */
import { BasePage } from './BasePage.js';

export class LoginPage extends BasePage {
    /** @param {Page} page */
    constructor(page) {
        super(page);
    }

    getUsernameInput() {
        return this.getById('user-name');
    }

    getPasswordInput() {
        return this.getById('password');
    }

    getLoginButton() {
        return this.getByRoleLocator('button', { name: /login/i });
    }

    getErrorContainer() {
        return this.getByDataTest('error');
    }

    getErrorText() {
        return this.getByTextLocator('Epic sadface', { exact: false });
    }

    getErrorDismissButton() {
        return this.getByCss('.error-button');
    }

    getLoginLogo() {
        return this.getByTextLocator('Swag Labs');
    }

    async goto() {
        await this.navigate('/');
    }

    async login(username, password) {
        await this.fillLocator(this.getUsernameInput(), username);
        await this.fillLocator(this.getPasswordInput(), password);
        await this.clickLocator(this.getLoginButton());
    }

    async getErrorMessage() {
        return await this.getTextFromLocator(this.getErrorContainer());
    }

    async dismissError() {
        await this.clickLocator(this.getErrorDismissButton());
    }

    async isErrorVisible() {
        return await this.isLocatorVisible(this.getErrorContainer());
    }

    async isLogoVisible() {
        return await this.isLocatorVisible(this.getLoginLogo());
    }

    async clearUsername() {
        await this.getUsernameInput().clear();
    }

    async clearPassword() {
        await this.getPasswordInput().clear();
    }
}
