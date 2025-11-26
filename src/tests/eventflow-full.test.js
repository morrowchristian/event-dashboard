// tests/eventflow-full.test.js
import { test, expect } from '@playwright/test';

const BASE_URL = 'http://127.0.0.1:5500';

test.describe('EventFlow Dashboard - Full Regression Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    // Clear only our app data, not everything
    await page.evaluate(() => {
      localStorage.removeItem('EVENTS_DATA');
    });
    await page.reload();
    await page.waitForLoadState('networkidle');
  });

  test('1. Page loads with correct title and layout', async ({ page }) => {
    await expect(page).toHaveTitle(/Team Event Dashboard/);
    await expect(page.locator('h1')).toContainText('EventFlow');
    await expect(page.locator('.sidebar')).toBeVisible();
    await expect(page.locator('.main-content')).toBeVisible();
    await expect(page.locator('#add-event-btn')).toBeVisible();
  });

  test('2. Mobile menu toggle works', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const sidebar = page.locator('#sidebar');
    const toggle = page.locator('#mobile-menu-toggle');

    await expect(sidebar).not.toHaveClass(/mobile-open/);
    await toggle.click();
    await expect(sidebar).toHaveClass(/mobile-open/);
    await page.click('body');
    await expect(sidebar).not.toHaveClass(/mobile-open/);
  });

  test('3. Add new event - full flow', async ({ page }) => {
    await page.click('#add-event-btn');
    await expect(page.locator('#event-modal')).not.toHaveClass(/hidden/);

    await page.fill('#event-title', 'Playwright Test Event');
    await page.fill('#event-date', '2025-12-31');
    await page.fill('#event-time', '15:30');
    await page.selectOption('#event-status', 'upcoming');
    await page.click('#submit-btn');

    // Wait for the success notification (avoid strict mode violation)
    await expect(page.locator('.notification').last()).toContainText('added successfully', { timeout: 10000 });

    await expect(page.locator('.event-item')).toContainText('Playwright Test Event');
    await expect(page.locator('.event-item')).toContainText('03:30 PM');
  });

  test('4. Edit existing event', async ({ page }) => {
    // Create event first
    await page.click('#add-event-btn');
    await page.fill('#event-title', 'To Be Edited');
    await page.fill('#event-date', '2025-12-30');
    await page.fill('#event-time', '10:00');
    await page.click('#submit-btn');
    await page.waitForTimeout(800);

    await page.click('.edit-btn');
    await page.fill('#event-title', 'Edited by Playwright');
    await page.selectOption('#event-status', 'ongoing');
    await page.click('#submit-btn');

    await expect(page.locator('.notification').last()).toContainText('updated successfully');
    await expect(page.locator('.event-item')).toContainText('Edited by Playwright');
  });

  test('5. Delete event with confirmation', async ({ page }) => {
    await page.click('#add-event-btn');
    await page.fill('#event-title', 'Delete Me Please');
    await page.fill('#event-date', '2025-12-29');
    await page.fill('#event-time', '11:00');
    await page.click('#submit-btn');
    await page.waitForTimeout(800);

    const initialCount = await page.locator('.event-item').count();
    await page.click('.delete-btn');
    await expect(page.locator('#delete-modal')).not.toHaveClass(/hidden/);
    await expect(page.locator('#delete-event-title')).toContainText('Delete Me Please');

    await page.click('#confirm-delete');
    await expect(page.locator('.notification').last()).toContainText('deleted permanently');

    const finalCount = await page.locator('.event-item').count();
    expect(finalCount).toBe(initialCount - 1);
  });

  test('6. Form validation works', async ({ page }) => {
    await page.click('#add-event-btn');
    await page.click('#submit-btn');

    await expect(page.locator('#title-error')).toBeVisible();
    await expect(page.locator('#date-error')).toBeVisible();
    await expect(page.locator('#time-error')).toBeVisible();
    await expect(page.locator('#event-title')).toHaveClass(/error/);
  });

  test('7. Events persist after reload', async ({ page }) => {
    await page.click('#add-event-btn');
    await page.fill('#event-title', 'Survives Reload');
    await page.fill('#event-date', '2025-12-28');
    await page.fill('#event-time', '14:00');
    await page.click('#submit-btn');
    await page.waitForTimeout(800);

    await page.reload();
    await page.waitForLoadState('networkidle');

    await expect(page.locator('.event-item')).toContainText('Survives Reload');
  });

  test('8. Events sorted correctly by date/time', async ({ page }) => {
    const events = [
      { title: 'Z Last', date: '2025-12-25', time: '16:00' },
      { title: 'A First', date: '2025-12-25', time: '09:00' },
      { title: 'B Middle', date: '2025-12-25', time: '12:00' },
    ];

    for (const ev of events) {
      await page.click('#add-event-btn');
      await page.fill('#event-title', ev.title);
      await page.fill('#event-date', ev.date);
      await page.fill('#event-time', ev.time);
      await page.click('#submit-btn');
      await page.waitForTimeout(300);
    }

    await page.reload();
    await page.waitForTimeout(1000);

    const titles = await page.locator('.event-item .event-title').allTextContents();
    expect(titles[0]).toBe('A First');
    expect(titles[1]).toBe('B Middle');
    expect(titles[2]).toBe('Z Last');
  });

  test('9. Action buttons appear on hover', async ({ page }) => {
    await page.click('#add-event-btn');
    await page.fill('#event-title', 'Hover Test');
    await page.fill('#event-date', '2025-12-27');
    await page.fill('#event-time', '13:00');
    await page.click('#submit-btn');
    await page.waitForTimeout(800);

    const firstEvent = page.locator('.event-item').first();
    const actions = firstEvent.locator('.event-actions');

    await expect(actions).toHaveCSS('opacity', '0');
    await firstEvent.hover();
    await expect(actions).toHaveCSS('opacity', '1');
  });

  test('10. Real-time clock updates', async ({ page }) => {
    const time1 = await page.locator('#current-time').textContent();
    await page.waitForTimeout(2500);
    const time2 = await page.locator('#current-time').textContent();
    expect(time1).not.toBe(time2);
  });
});