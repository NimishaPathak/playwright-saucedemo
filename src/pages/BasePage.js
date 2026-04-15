/**
 * @typedef {import('@playwright/test').Page} Page
 * @typedef {import('@playwright/test').Locator} Locator
 */
export class BasePage {
    /** @param {Page} page */
    constructor(page) {
        /** @type {Page} */
        this.page = page;
    }

    async navigate(path = '') {
        await this.page.goto(path);
    }

    async getTitle() {
        return await this.page.title();
    }

    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
    }

    getById(id) {
        return this.page.locator(`#${id}`);
    }
    getByRoleLocator(role, options = {}) {
        return this.page.getByRole(role, options);
    }

    getByTextLocator(text, options = {}) {
        return this.page.getByText(text, options);
    }

    getByLabelLocator(text, options = {}) {
        return this.page.getByLabel(text, options);
    }

    getByDataTest(value) {
        return this.page.locator(`[data-test="${value}"]`);
    }

    getByCss(selector) {
        return this.page.locator(selector);
    }

    async waitForLocator(locator, timeout = 10000) {
        await locator.waitFor({ state: 'visible', timeout });
    }

    async clickLocator(locator) {
        await this.waitForLocator(locator);
        await locator.click();
    }

    async fillLocator(locator, value) {
        await this.waitForLocator(locator);
        await locator.fill(value);
    }

    async getTextFromLocator(locator) {
        await this.waitForLocator(locator);
        return await locator.textContent();
    }

    async isLocatorVisible(locator) {
        return await locator.isVisible();
    }

    async takeScreenshot(name) {
        await this.page.screenshot({
            path: `test-results/screenshots/${name}.png`,
            fullPage: true,
        });
    }
}