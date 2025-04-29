// npx playwright test TC11-2.test.js
// User Story 2-4 : Admin view all reviews
import { test, expect } from '@playwright/test';

test('TC11-2 - admin sees "no reviews found" when no reviews exist in the system', async ({ page }) => {
    // 1. Navigate to the homepage
    await page.goto('https://sw-softserve.vercel.app/');
    await page.waitForSelector('a[href="/user"] svg'); // Wait for the user icon to appear, indicating the page has loaded

    // 2. Click the user icon → this should redirect to the login page
    await page.click('a[href="/user"]');
    await expect(page).toHaveURL(
        'https://sw-softserve.vercel.app/login?callbackUrl=https%3A%2F%2Fsw-softserve.vercel.app%2Fuser'
    ); // Assert URL redirection to login page

    // 3. Log in with valid admin credentials
    await page.getByRole('textbox', { name: 'Email' }).fill('admin@admin.com'); // Fill in the admin email
    await page.getByRole('textbox', { name: 'Password' }).fill('12345678'); // Fill in the admin password
    await page.getByRole('button', { name: 'Login' }).click(); // Submit the login form

    // 4. Wait for the redirect back to the homepage after a successful login
    await expect(page).toHaveURL('https://sw-softserve.vercel.app/'); // Assert the homepage URL after login

    // 5. Click on the Admin link to access the admin dashboard
    await expect(page.getByText('Admin')).toBeVisible(); // Ensure that the AdminHome link is visible after login
    await page.getByRole('link', { name: 'Admin' }).click(); // Click on the Admin link to go to the admin dashboard
    await expect(page).toHaveURL('https://sw-softserve.vercel.app/admin'); // Assert the Admin page URL

    // 6. Simulate no reviews by mocking the API response (empty review list)
    await page.route(`https://softserve-backend.vercel.app/api/v1/reviews`, async route => {
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ data: [] }), // Return an empty array to simulate no reviews available
        });
    });

    // 7. Navigate to the Review & Rating section to see the message when no reviews exist
    await page.goto('https://sw-softserve.vercel.app/admin/reviews'); // Go to the reviews section

    // 8. Verify that the "No reviews found" message is displayed on the page
    await expect(page.locator('div').filter({ hasText: 'No reviews found' }).nth(1)).toBeVisible(); // Assert the "No reviews found" message is visible
    await expect(page.getByText('No reviews found.')).toBeVisible(); // Additional check for the "No reviews found" message

    // 9. Add a small delay for asynchronous actions to settle (if necessary)
    await page.waitForTimeout(7000); // Wait for any potential asynchronous actions to complete

});

// // Test with real database interaction

    // // 1. Navigate to the homepage
    // await page.goto('https://sw-softserve.vercel.app/');
    // await page.waitForSelector('a[href="/user"] svg'); // Wait for the user icon to load, indicating the page is ready

    // // 2. Click the user icon → this should redirect to the login page
    // await page.click('a[href="/user"]'); 
    // await expect(page).toHaveURL(
    //   'https://sw-softserve.vercel.app/login?callbackUrl=https%3A%2F%2Fsw-softserve.vercel.app%2Fuser' // Assert URL redirection to login page
    // );

    // // 3. Log in with valid admin credentials
    // await page.getByRole('textbox', { name: 'Email' }).fill('admin@admin.com'); // Fill in the admin email
    // await page.getByRole('textbox', { name: 'Password' }).fill('12345678'); // Fill in the password
    // await page.getByRole('button', { name: 'Login' }).click(); // Submit the login form

    // // 4. Wait for the redirect back to the homepage after login
    // await page.waitForURL('https://sw-softserve.vercel.app/', { timeout: 7000 }); // Wait for the page to load
    // await expect(page).toHaveURL('https://sw-softserve.vercel.app/'); // Assert the homepage URL after login

    // // 5. Click on the Admin link to access the admin dashboard
    // await expect(page.getByText('AdminHome')).toBeVisible(); // Assert that the AdminHome link is visible after login
    // await page.getByRole('link', { name: 'Admin' }).click(); // Click on the Admin link to go to the admin dashboard
    // await page.waitForURL('https://sw-softserve.vercel.app/admin', { timeout: 7000 }); // Wait for the Admin page to load
    // await expect(page).toHaveURL('https://sw-softserve.vercel.app/admin'); // Assert the Admin page URL

    // // 6. Navigate to the Review & Rating section
    // await expect(page.getByRole('link', { name: 'Review & Rating' })).toBeVisible(); // Ensure the Review & Rating link is visible
    // await page.getByRole('link', { name: 'Review & Rating' }).click(); // Click on the Review & Rating link
    // await page.waitForURL('https://sw-softserve.vercel.app/admin/reviews', { timeout: 7000 }); // Wait for the Review & Rating page to load
    // await expect(page).toHaveURL('https://sw-softserve.vercel.app/admin/reviews'); // Assert the correct URL for the Review & Rating page

    // // 7. Verify core dashboard elements are visible
    // await expect(page.getByText('Restaurant Reviews Dashboard')).toBeVisible(); // Verify the dashboard title
    // await expect(page.getByText('Restaurant', { exact: true })).toBeVisible(); // Verify the 'Restaurant' column header
    // await expect(page.getByRole('combobox', { name: 'All restaurants' })).toBeVisible(); // Verify the restaurant dropdown
    // await expect(page.getByText('Rating', { exact: true })).toBeVisible(); // Verify the 'Rating' column header
    // await expect(page.getByRole('button', { name: 'Filter Reviews' })).toBeVisible(); // Verify the 'Filter Reviews' button
    // await expect(page.getByRole('button', { name: 'Clear Filters' })).toBeVisible(); // Verify the 'Clear Filters' button

    // // 8. Apply filters: select "Sweet Haven Bakery" and rating 5
    // await page.getByRole('combobox', { name: 'All restaurants' }).click(); // Click the restaurant dropdown
    // await page.getByRole('option', { name: 'Sweet Haven Bakery' }).click(); // Select "Sweet Haven Bakery"
    // await page.locator('select').selectOption('5'); // Select rating 5
    // await page.getByRole('button', { name: 'Filter Reviews' }).click(); // Apply the filter

    // // 9. After filtering, expect a "No reviews found." message (if no matching review exists)
    // const noReviewsText = page.getByText('No reviews found.'); // Locate the "No reviews found" message
    // await expect(noReviewsText).toBeVisible(); // Verify that the "No reviews found" message is visible

    // // 10. NOTE: This test interacts with live data from the production (or staging) database.
    // //     It ensures that the system retrieves real user reviews directly from the backend database, 
    // //     verifying that the reviews displayed on the UI are up-to-date and accurately reflect the data stored in the database.
    // //     The test also checks that when no matching reviews are found, the appropriate "No reviews found" message is displayed.