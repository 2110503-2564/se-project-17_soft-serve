// npx playwright test TC12-1.test.js
// User Story 2-5 : Admin delete review
import { test, expect } from '@playwright/test';


test('TC12-1 - As an admin I want to delete review So that I can ensure the quality of the data is maintained(valid)', async ({ page }) => {
  test.setTimeout(120_000);

  await page.goto('https://sw-softserve.vercel.app/login');

  // Fill in email
  await page.getByRole('textbox', { name: 'Email' }).fill('nongped@review.com');

  // Fill in password
  await page.getByRole('textbox', { name: 'Password' }).fill('12345678');

  // Click the login button
  await page.getByRole('button', { name: 'Login' }).click();

  await page.waitForURL('https://sw-softserve.vercel.app/');

  await page.goto('https://sw-softserve.vercel.app/rating/68067b227593c0125ca1acde');

  await page.getByRole('textbox', { name: 'How was your dining experience? Tell us what you loved (or didn’t)!' })
  .fill('อย่าลบของผมเลยยยยยยย ถือว่าเป็ดขอ');

  async function rateCategory(name, stars) {
    // grab all <label> whose for="Food Rating-«r1»" … etc
    const labels = page.locator(`label[for^="${name} Rating-"]`);
    // click the (stars-1)th one, forcing through any overlay
    await labels.nth(stars - 1).click({ force: true });
  }

  // 4) Rate each category
  await rateCategory('Food',            5);
  await rateCategory('Service',         5);
  await rateCategory('Ambiance',        5);
  await rateCategory('Value for Money', 5);

  await page.getByRole('button', { name: 'Submit Your Review'}).click();

  await page.goto('https://sw-softserve.vercel.app/user');

  await page.getByRole('button', {name: 'Log Out'}).click();

  await page.waitForURL('https://sw-softserve.vercel.app/login?callbackUrl=https%3A%2F%2Fsw-softserve.vercel.app%2Fuser');

  // Fill in email
  await page.getByRole('textbox', { name: 'Email' }).fill('admin@admin.com');

  // Fill in password
  await page.getByRole('textbox', { name: 'Password' }).fill('12345678');

  // Click the login button
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByRole('link', {name: 'Admin'}).click();

  await page.getByRole('link', {name: 'Review & Rating'}).click();

  await page.locator('input[placeholder="All restaurants"]').fill('ped');
  await page.locator('input[placeholder="All restaurants"]').press('Enter');

  await page.getByRole('button', { name: 'Filter Reviews' }).click();

  

  page.on('dialog', dialog => dialog.accept());

  const card = page.locator('text=Customer: pednoi').locator('..').locator('..'); // go up 2 parents
  const cardCount = await card.count();

  // expect(cardCount).toBe(1);

  await card.getByRole('button', { name: 'delete' }).first().click();

  await page.reload();

  const card2 = page.locator('text=Customer: pednoi').locator('..').locator('..');
  const card2Count = await card2.count();

  
  expect(card2Count).toBe(0);

});

