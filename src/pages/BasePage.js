// src/pages/BasePage.js
export class BasePage {
    constructor(page) {
        this.page = page;
    }

    // ─── NAVIGATION ──────────────────────────────────────────────
    async navigate(path = '') {
        await this.page.goto(path);
    }

    async getTitle() {
        return await this.page.title();
    }

    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
    }

    // ─── LOCATOR HELPERS (return Locator objects) ─────────────────

    // Priority 1: by ID
    getById(id) {
        return this.page.locator(`#${id}`);
    }

    // Priority 2: by Role (best for buttons, links)
    getByRoleLocator(role, options = {}) {
        return this.page.getByRole(role, options);
    }

    // Priority 3: by visible Text
    getByTextLocator(text, options = {}) {
        return this.page.getByText(text, options);
    }

    // Priority 4: by Label (for form fields)
    getByLabelLocator(text, options = {}) {
        return this.page.getByLabel(text, options);
    }

    // Priority 5: by data-test attribute
    getByDataTest(value) {
        return this.page.locator(`[data-test="${value}"]`);
    }

    // Priority 6: by CSS (last resort)
    getByCss(selector) {
        return this.page.locator(selector);
    }

    // ─── WAIT HELPERS ────────────────────────────────────────────
    async waitForLocator(locator, timeout = 10000) {
        await locator.waitFor({ state: 'visible', timeout });
    }

    // ─── ACTION HELPERS ──────────────────────────────────────────
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

    // ─── SCREENSHOT ──────────────────────────────────────────────
    async takeScreenshot(name) {
        await this.page.screenshot({
            path: `test-results/screenshots/${name}.png`,
            fullPage: true,
        });
    }
}