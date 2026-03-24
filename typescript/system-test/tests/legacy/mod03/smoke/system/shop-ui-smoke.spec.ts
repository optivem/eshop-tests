/**
 * V1 smoke test: raw browser.
 * Uses configuration + Playwright page; no driver. Setup: setUpShopBrowser equivalent (page from fixture).
 */
import '../../../../../setup-config.js';
import { test } from '@playwright/test';
import { testConfig } from '../../../../../src/index.js';

test.describe('V1 Shop UI Smoke Tests', () => {
    test('should be able to go to shop', async ({ page }) => {
        const response = await page.goto(testConfig.urls.shopUi);
        test.expect(response?.status()).toBe(200);

        const contentType = response?.headers()['content-type'];
        test.expect(contentType).toBeDefined();
        test.expect(contentType).toContain('text/html');

        const pageContent = await page.content();
        test.expect(pageContent).toContain('<html');
        test.expect(pageContent).toContain('</html>');
    });
});
