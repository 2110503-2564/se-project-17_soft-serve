// npx playwright test TC10-1.test.js
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

test('TC10-1 : should display existing ratings and reviews', async ({ page }) => {
    // Mock data for existing reviews (replace with actual API calls if needed)
    await page.route(`${BE_URL}/api/v1/reviews`, async route => {
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                data: [
                    { _id: '1', rating: 5, review: 'Review 1', createdAt: '2025-04-21T00:00:00.000Z', customerId: { name: 'Customer 1' } },
                    { _id: '2', rating: 4, review: 'Review 2', createdAt: '2025-04-22T00:00:00.000Z', customerId: { name: 'Customer 2' } },
                    { _id: '3', rating: 3, review: 'Review 3', createdAt: '2025-04-23T00:00:00.000Z', customerId: { name: 'Customer 3' } },
                    { _id: '4', rating: 2, review: 'Review 4', createdAt: '2025-04-24T00:00:00.000Z', customerId: { name: 'Customer 4' } },
                    { _id: '5', rating: 1, review: 'Review 5', createdAt: '2025-04-25T00:00:00.000Z', customerId: { name: 'Customer 5' } }
                ],
            }),
        });
    });
    await page.goto(`${FE_URL}/manager/reviews`);
        
    // Assert that all reviews are displayed
    await expect(page.locator('#numberOfReviews')).toHaveText('5 Reviews Found');
    // Wait for review cards to be visible
    await page.waitForSelector('.border.rounded-lg', { state: 'visible' });
    const reviewElements = await page.locator('.border.rounded-lg').all();
    expect(reviewElements.length).toBeGreaterThanOrEqual(5);
    await page.waitForTimeout(3000);
});