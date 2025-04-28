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

test('TC8-2 : User can view reviews of a restaurant but no reviews found', async ({ page }) => {
    test.setTimeout(60000)

    // mock data for existing reviews 
    await page.route(`${BE_URL}/api/v1/restaurants/6809deb1cd30964947417820/reviews`, async route => {
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ data: [] }),
        });
    });

    await page.waitForTimeout(3000);

    // go to restaurants page
    await expect(page.getByText('HomeRestaurantsReservationsNotifications')).toBeVisible();
    await page.getByRole('link', { name: 'Restaurants' }).click();
    await expect(page).toHaveURL(`${FE_URL}/restaurants`);

    await page.waitForTimeout(3000);
    
    // click on view more reviews Cat addicted
    await page.locator('div').filter({ hasText: /^Cat addicted\( View more reviews \)$/ }).getByRole('link').click();
    await page.waitForURL(`${FE_URL}/rating/6809deb1cd30964947417820/view`, { timeout: 7000});

    // check in page content
    await expect(page.getByText('[ Cat addicted ]')).toBeVisible();
    await expect(page.getByText('Overall Rating')).toBeVisible();
    await expect(page.getByText('/5')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Reviews Found' })).toBeVisible();
    await expect(page.locator('div').filter({ hasText: '0 Reviews FoundNo reviews' }).nth(1)).toBeVisible();  
    await expect(page.getByText('No reviews found. Be the')).toBeVisible();

    await page.waitForTimeout(3000);
});