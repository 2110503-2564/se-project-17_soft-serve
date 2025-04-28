// npx playwright test TC10-2.test.js
// User Story 2-3 : Restaurant view own restaurant’s reviews
import { test, expect } from '@playwright/test';

const FE_URL = 'https://sw-softserve.vercel.app';
const BE_URL = 'https://softserve-backend.vercel.app';

// Login before each test
test.beforeEach(async ({ page }) => {
    await page.goto(`${FE_URL}/login`);
    await page.fill('#email', 'eiei@eiei.com');
    await page.fill('#password', '12345678');
    await page.click('button[type="submit"]');
    await page.waitForURL(`${FE_URL}`);
});

test('TC10-2 : should display "No reviews found" message when no reviews exist', async ({ page }) => {
    // Mock data for no reviews
    await page.route(`${BE_URL}/api/manager/reviews`, async route => {
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([]),
        });
    });
    await page.goto(`${FE_URL}/manager/reviews`);
        
    // Assert that the "No reviews found." message is visible
    await expect(page.locator('#noReviews')).toHaveText('No reviews found.');
    // Assert that the reviews count is also 0
    await expect(page.locator('#numberOfReviews')).toHaveText('0 Reviews Found');
});