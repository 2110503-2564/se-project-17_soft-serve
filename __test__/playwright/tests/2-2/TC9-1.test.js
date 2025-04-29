// npx playwright test TC9-1.test.js
// User Story 2-2 : User rate and review a restaurant
import { test, expect } from '@playwright/test';

test('TC9-1 - providing all stars with comment will successfully create review', async ({ page }) => {
  test.setTimeout(60000)
  await page.goto('https://sw-softserve.vercel.app/');
  await page.getByRole('link').filter({ hasText: /^$/ }).nth(1).click();

  await page.waitForURL('https://sw-softserve.vercel.app/login?callbackUrl=https%3A%2F%2Fsw-softserve.vercel.app%2Fuser');
  await page.getByRole('textbox', { name: 'Email' }).fill('sa@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('12345678');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL('https://sw-softserve.vercel.app/');

  await page.getByRole('link', { name: 'Restaurants' }).click();
  await page.locator('div').filter({ hasText: /^Restaurant Meow\( View more reviews \)$/ }).getByRole('link').click();
  
  // รอให้รีวิวโหลดก่อนการนับ
  await page.waitForURL('https://sw-softserve.vercel.app/rating/67fcc9e6a01ca66bc0923e79/view');
  await page.waitForSelector('text=Customer:');  // รอให้มีรีวิวปรากฏ
  // นับจำนวนรีวิวก่อน
  const reviewLocator = page.locator('text=Customer:'); // ใช้ text ที่ตรงกับรีวิว
  const reviewCountBefore = await reviewLocator.count();

  await page.goto('https://sw-softserve.vercel.app/restaurants');
  await page.locator('div:nth-child(5) > a:nth-child(2) > .mt-4').first().click();
  await page.waitForURL('https://sw-softserve.vercel.app/rating/67fcc9e6a01ca66bc0923e79');
  // กรอกฟอร์มรีวิว
  await page.locator('[id="Food\\ Rating"] label').filter({ hasText: '3 Stars' }).click();
  await page.locator('[id="Service\\ Rating"] label').filter({ hasText: '4 Stars' }).click();
  await page.locator('[id="Ambiance\\ Rating"] label').filter({ hasText: '5 Stars' }).click();
  await page.locator('label').filter({ hasText: '2 Stars' }).nth(3).click();

  await page.getByRole('textbox', { name: 'How was your dining' }).fill(
    'This restaurant has excellent ambiance and good service, but the food was average and a bit overpriced.'
  );

  const dialogPromise = page.waitForEvent('dialog');
  await page.getByRole('button', { name: 'Submit Your Review' }).click();
  const dialog = await dialogPromise;
  expect(dialog.message()).toContain('successfully');
  await dialog.dismiss();

  // กลับไปหน้า restaurants แล้วเข้าใหม่อีกรอบ
  await page.waitForURL('https://sw-softserve.vercel.app/restaurants');
  await page.locator('div').filter({ hasText: /^Restaurant Meow\( View more reviews \)$/ }).getByRole('link').click();
  await page.waitForURL('https://sw-softserve.vercel.app/rating/67fcc9e6a01ca66bc0923e79/view');
  // รอให้โหลดข้อมูลเสร็จ (เพิ่มการรออย่างเหมาะสม)
  await page.waitForSelector('text=Customer:');  // รอให้รีวิวโหลดมาใหม่

  // นับจำนวนรีวิวหลังเพิ่ม
  const reviewCountAfter = await reviewLocator.count();

  // ตรวจสอบว่ารีวิวเพิ่มขึ้น 1 ตัว
  await expect(reviewCountAfter).toBe(reviewCountBefore + 1);  // ตรวจสอบจำนวนรีวิวที่เพิ่มขึ้น
  await page.waitForTimeout(3000);
});
