import { test, expect } from '@playwright/test';

/**
 * Every skeleton route must resolve. Later work orders replace the placeholder bodies; navigation
 * is settled here so they do not each invent it.
 */
const routes = [
  '/',
  '/daftar',
  '/daftar/persetujuan',
  '/daftar/identitas',
  '/daftar/kendaraan',
  '/daftar/dokumen',
  '/daftar/ringkasan',
  '/daftar/selesai',
  '/kendaraan',
  '/kendaraan/ST-2026-0814-77213',
  '/kendaraan/ST-2026-0814-77213/qr',
];

for (const route of routes) {
  test(`${route} resolves and renders a heading`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response?.status()).toBeLessThan(400);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
}

test('document language is Indonesian', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'id');
});

test('the journey is reachable by keyboard from the home page', async ({ page }) => {
  await page.goto('/');
  // First tab reaches the skip link, then the continue action.
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: /lewati ke konten/i })).toBeFocused();
});

test('an unknown route renders the not-found page', async ({ page }) => {
  await page.goto('/tidak-ada-halaman-ini');
  await expect(page.getByRole('heading', { name: /tidak ditemukan/i })).toBeVisible();
});
