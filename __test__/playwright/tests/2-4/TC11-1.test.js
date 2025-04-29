// npx playwright test TC11-1.test.js
// User Story 2-4 : Admin view all reviews
import { test, expect } from '@playwright/test';

test('TC11-1 - admin can view all reviews when reviews exist in the system', async ({ page }) => {
  
  // 1. Navigate to the homepage
  await page.goto('https://sw-softserve.vercel.app/');
  
  // 2. Wait for the user icon to appear, indicating the user is on the correct page
  await page.waitForSelector('a[href="/user"] svg'); // Wait for user icon to appear

  // 3. Click the user icon to initiate login process → should redirect to login page
  await page.click('a[href="/user"]');
  
  // 4. Assert that the page URL changes to the login page
  await expect(page).toHaveURL(
    'https://sw-softserve.vercel.app/login?callbackUrl=https%3A%2F%2Fsw-softserve.vercel.app%2Fuser'
  );

  // 5. Fill in admin credentials and submit the login form
  await page.getByRole('textbox', { name: 'Email' }).fill('admin@admin.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('12345678');
  await page.getByRole('button', { name: 'Login' }).click();

  // 6. Wait for redirect back to the homepage after login
  await expect(page).toHaveURL('https://sw-softserve.vercel.app/');

  // 7. Click on the Admin link to access the admin dashboard
  await expect(page.getByText('Admin')).toBeVisible();
  await page.getByRole('link', { name: 'Admin' }).click();
  
  // 8. Assert that the page URL is now the Admin dashboard
  await expect(page).toHaveURL('https://sw-softserve.vercel.app/admin');

  // 9. Mock the API call for review data
  await page.route(`https://softserve-backend.vercel.app/api/v1/reviews`, async route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: [
          {
            _id: '1',
            rating: 5,
            review: 'Excellent service and food quality.',
            customerId: { name: 'John Doe' },
            restaurantId: { name: 'Pizza Place' },
            createdAt: '2025-04-21T00:00:00.000Z'
          },
          {
            _id: '2',
            rating: 4,
            review: 'Good service. Would recommend.',
            customerId: { name: 'Jane Smith' },
            restaurantId: { name: 'Burger Joint' },
            createdAt: '2025-04-22T00:00:00.000Z'
          },
          {
            _id: '3',
            rating: 3,
            review: 'Okay food, service could be better.',
            customerId: { name: 'Michael Lee' },
            restaurantId: { name: 'Taco Haven' },
            createdAt: '2025-04-23T00:00:00.000Z'
          },
          {
            _id: '4',
            rating: 5,
            review: 'Absolutely loved this restaurant!',
            customerId: { name: 'Sara Lee' },
            restaurantId: { name: 'Italian Bistro' },
            createdAt: '2025-04-24T00:00:00.000Z'
          },
          {
            _id: '5',
            rating: 4,
            review: 'Great experience! Best pizza.',
            customerId: { name: 'David Bright' },
            restaurantId: { name: 'Pasta Pizza Place' },
            createdAt: '2025-04-25T00:00:00.000Z'
          }
        ]
      }),
    });
  });

  // 10. Navigate to the Review & Rating section
  await expect(page.getByRole('link', { name: 'Review & Rating' })).toBeVisible();
  await page.getByRole('link', { name: 'Review & Rating' }).click();
  
  // 11. Assert that the page URL is now the Review & Rating page
  await expect(page).toHaveURL('https://sw-softserve.vercel.app/admin/reviews');

  // 12. Check for visibility of key dashboard elements
  await expect(page.getByText('Restaurant Reviews Dashboard')).toBeVisible();
  await expect(page.getByText('Restaurant', { exact: true })).toBeVisible();
  await expect(page.getByRole('combobox', { name: 'All restaurants' })).toBeVisible();
  await expect(page.getByText('Rating', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Filter Reviews' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Clear Filters' })).toBeVisible();

  // 13. Check if the number of reviews matches the mocked data (5 reviews in this case)
  await expect(page.getByText('5 Reviews Found')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Reviews Found' })).toBeVisible();

  // 14. (Optional) Check that all the reviews are displayed as expected.
  // Note: These are commented out for now. You can uncomment if you'd like to assert for individual reviews.
  // await expect(page.getByText('Pizza PlaceCustomer: John Doe★★★★☆21/04/2025Excellent service and food quality.')).toBeVisible();
  // await expect(page.getByText('Burger JointCustomer: Jane Smith★★★★☆22/04/2025Good service. Would recommend.')).toBeVisible();
  // await expect(page.getByText('Taco HavenCustomer: Michael Lee★★★☆☆23/04/2025Okay food, service could be better.')).toBeVisible();
  // await expect(page.getByText('Italian BistroCustomer: Sara Lee★★★★☆24/04/2025Absolutely loved this restaurant!')).toBeVisible();
  // await expect(page.getByText('Pasta Pizza PlaceCustomer: David Bright★★★★☆25/04/2025Great experience! Best pizza.')).toBeVisible();

  // 15. Wait for asynchronous actions to complete
  await page.waitForTimeout(7000); // Optional wait time for potential asynchronous actions

  // 16. Acceptance criteria: No reviews message when no reviews exist (can be used in another test case)
  

});


// // Test with real database interaction

// // 1. Navigate to the homepage
// await page.goto('https://sw-softserve.vercel.app/');
// await page.waitForSelector('a[href="/user"] svg'); // Wait for the user icon to load, indicating that the page is ready

// // 2. Click the user icon → should redirect to the login page
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

// // 8. Confirm "Reviews Found" heading is visible
// await expect(page.getByRole('heading', { name: 'Reviews Found' })).toBeVisible(); // Verify that the heading 'Reviews Found' is visible

// // 9. Check that at least one review is present before applying any filters
// const reviewBox = page.locator('.space-y-6 > div').first(); // Locate the first review box in the list
// await expect(reviewBox).toBeVisible(); // Assert that at least one review box is visible

// // NOTE: This test interacts with live data from the production (or staging) database.
// // It ensures that the system retrieves real user reviews directly from the backend database, 
// // verifying that the reviews displayed on the UI are up-to-date and accurately reflect the data stored in the database.


