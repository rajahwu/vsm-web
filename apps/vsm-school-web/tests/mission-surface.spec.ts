import { test, expect, type Page } from '@playwright/test';

type Viewport = { name: string; width: number; height: number };

const viewports: Viewport[] = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

async function runCoreFlow(page: Page) {
  await page.goto('/mission');
  
  // Wait for initial sync loading to disappear
  const loading = page.locator('#loading-core');
  await expect(loading).not.toBeVisible({ timeout: 30000 });

  // Ensure track selection screen appears
  const firstHeading = page.getByText('Choose Time Window');
  await firstHeading.waitFor({ state: 'attached', timeout: 20000 });
  await expect(firstHeading).toBeVisible();
  
  // Mobile transition delay
  await page.waitForTimeout(2000);
  await page.getByRole('button', { name: 'Sprint' }).click({ force: true });
  
  // Wait for navigation and ensure track selection screen appears
  await expect(page.getByText('Select Mission Track')).toBeVisible({ timeout: 15000 });
  await page.getByRole('button', { name: 'The Alphabet' }).click();

  await expect(page.getByText('Codex Entry')).toBeVisible();
  await expect(page.getByText('Audio')).toBeVisible();
  await page.getByRole('button', { name: /Continue/i }).click();

  await expect(page.getByText('STORY PROTOCOL')).toBeVisible();
  await page.getByRole('button', { name: 'Begin the Dot Ritual' }).click();

  await expect(page.getByText('PRIME: The Dot')).toBeVisible();
  await page.getByRole('button', { name: /START 60S DRILL/i }).click();
  await page.getByRole('button', { name: /Finished Early/i }).click();

  await expect(page.getByText('Work Surface')).toBeVisible();
  await page.getByPlaceholder('Begin writing...').fill('Test output for mission surface.');
  await page.getByRole('button', { name: /ARCHIVE OUTPUT/i }).click();

  await expect(page.getByText('ATOM SHIPPED')).toBeVisible();
}

test.describe('Mission Surface responsive flow', () => {
  for (const viewport of viewports) {
    test(`runs core flow on ${viewport.name}`, async ({ page }) => {
      page.on('console', msg => console.log(`BROWSER LOG [${viewport.name}]:`, msg.text()));
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await runCoreFlow(page);
    });
  }
});
