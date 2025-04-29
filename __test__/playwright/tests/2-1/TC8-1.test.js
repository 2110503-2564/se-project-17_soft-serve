// npx playwright test TC8-1.test.js
// User Story 2-1 : User view restaurant reviews
import { test, expect } from '@playwright/test';

const FE_URL = 'https://sw-softserve.vercel.app';
const BE_URL = 'https://softserve-backend.vercel.app';

// Login before test
test.beforeEach(async ({ page }) => {
    await page.goto(`${FE_URL}/login`);
    await page.fill('#email', 'user@user.com');
    await page.fill('#password', '12345678');
    await page.click('button[type="submit"]');
    await page.waitForURL(`${FE_URL}`, { timeout: 7000 });
});

test('TC8-1 : User can view reviews of a restaurant', async ({ page })  => {
    test.setTimeout(60000)

    // mock data for existing reviews 
    await page.route(`${BE_URL}/api/v1/restaurants/67fcc9e6a01ca66bc0923e79/reviews`, async route => {
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                data: [
                    { rating: 5, review: 'Review 1', customerId: '1',restaurantId: '67fcc9e6a01ca66bc0923e79', createdAt: '2025-04-21T00:00:00.000Z' },
                    { rating: 5, review: 'Review 2', customerId: '2',restaurantId: '67fcc9e6a01ca66bc0923e79', createdAt: '2025-04-22T00:00:00.000Z' },
                    { rating: 4.5, review: 'Review 3', customerId: '3',restaurantId: '67fcc9e6a01ca66bc0923e79', createdAt: '2025-04-23T00:00:00.000Z' },
                    { rating: 3.5, review: 'Review 4', customerId: '4',restaurantId: '67fcc9e6a01ca66bc0923e79', createdAt: '2025-04-24T00:00:00.000Z' },
                    { rating: 4, review: 'Review 5', customerId: '5',restaurantId: '67fcc9e6a01ca66bc0923e79', createdAt: '2025-04-25T00:00:00.000Z' }
                ],
            }),
        });
    });

    await page.route(`${BE_URL}/api/v1/restaurants/67fcc9e6a01ca66bc0923e79`, async route => {
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                data: {
                    name: 'Restaurant Meow',
                    ratingrating: 4.4, 
                },
            }),
        });
    });

    await page.waitForTimeout(3000);

    // go to restaurants page
    await expect(page.getByText('HomeRestaurantsReservationsNotifications')).toBeVisible();
    await page.getByRole('link', { name: 'Restaurants' }).click();
    await expect(page).toHaveURL(`${FE_URL}/restaurants`);

    await page.waitForTimeout(3000);
    
    // click on view more reviews Restaurant Meow
    await page.locator('div').filter({ hasText: /^Restaurant Meow\( View more reviews \)$/ }).getByRole('link').click();
    await page.waitForURL(`${FE_URL}/rating/67fcc9e6a01ca66bc0923e79/view`, { timeout: 7000});

    // check in page content
    await expect(page.getByText('[ Restaurant Meow ]')).toBeVisible();
    await expect(page.getByText('Overall Rating')).toBeVisible();
    await expect(page.getByText('/5')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Reviews Found' })).toBeVisible();
    await expect(page.locator('div').filter({ hasText: '5 Reviews FoundCustomer:' }).nth(1)).toBeVisible();
    await expect(page.locator('.border').first()).toBeVisible();       

    await page.waitForTimeout(3000);
    await page.waitForTimeout(3000);
});