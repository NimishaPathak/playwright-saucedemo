import { test as setup } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage.js';
import { users } from '../../src/utils/testData.js';

const authFile = 'playwright/.auth/user.json';

setup('authenticate as standard_user', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);

    // End of authentication steps
    await page.context().storageState({ path: authFile });
});