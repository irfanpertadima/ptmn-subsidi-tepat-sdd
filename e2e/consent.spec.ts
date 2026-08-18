import { test, expect } from '@playwright/test';

/**
 * The consent journey on the 360px viewport of the target device.
 *
 * The guard assertions matter most: they are the browser-level proof that a data-collecting step
 * cannot be reached without consent (control: PDP-CONSENT).
 */

test('explainer requires a vehicle type before continuing', async ({ page }) => {
  await page.goto('/daftar');
  await page.getByRole('button', { name: 'Lanjutkan' }).click();
  await expect(page.getByText('Pilih jenis kendaraan terlebih dahulu')).toBeVisible();
  await expect(page).toHaveURL(/\/daftar$/);
});

test('explainer carries the vehicle type into the consent step', async ({ page }) => {
  await page.goto('/daftar');
  await page.getByRole('radio', { name: /Roda 4/ }).check();
  await page.getByRole('button', { name: 'Lanjutkan' }).click();
  await expect(page).toHaveURL(/\/daftar\/persetujuan\?jenis=roda4/);
});

test('consent checkboxes start unticked', async ({ page }) => {
  await page.goto('/daftar/persetujuan');
  await expect(page.getByRole('checkbox', { name: /data pribadi saya diproses/i })).not.toBeChecked();
  await expect(page.getByRole('checkbox', { name: /data penggunaan anonim/i })).not.toBeChecked();
});

test('consent is required before the journey continues', async ({ page }) => {
  await page.goto('/daftar/persetujuan');
  await page.getByRole('button', { name: 'Saya Setuju' }).click();
  // Scoped by id: Next.js's route announcer is also role="alert", so the bare role matches two.
  await expect(page.locator('#persetujuan-error')).toHaveText(
    'Persetujuan diperlukan untuk melanjutkan pendaftaran',
  );
  await expect(page).toHaveURL(/persetujuan/);
});

test('granting consent advances to the identity step', async ({ page }) => {
  await page.goto('/daftar/persetujuan?jenis=roda4');
  await page.getByRole('checkbox', { name: /data pribadi saya diproses/i }).check();
  await page.getByRole('button', { name: 'Saya Setuju' }).click();
  await expect(page).toHaveURL(/\/daftar\/identitas/);
});

test('declining lands on the consequence screen with a route back', async ({ page }) => {
  await page.goto('/daftar/persetujuan');
  await page.getByRole('button', { name: 'Tidak Setuju' }).click();
  await expect(page.getByRole('heading', { name: /Tidak Dapat Dilanjutkan/ })).toBeVisible();
  await page.getByRole('link', { name: /Kembali ke Persetujuan/ }).click();
  await expect(page).toHaveURL(/persetujuan$/);
});

test('the guard redirects a data step entered without consent', async ({ page }) => {
  await page.goto('/daftar/identitas');
  await expect(page).toHaveURL(/\/daftar\/persetujuan/);
});

test('every guarded step redirects without consent', async ({ page }) => {
  for (const route of ['/daftar/identitas', '/daftar/kendaraan', '/daftar/dokumen', '/daftar/ringkasan']) {
    await page.goto(route);
    await expect(page).toHaveURL(/\/daftar\/persetujuan/);
  }
});

test('consent survives a reload', async ({ page }) => {
  await page.goto('/daftar/persetujuan');
  await page.getByRole('checkbox', { name: /data pribadi saya diproses/i }).check();
  await page.getByRole('button', { name: 'Saya Setuju' }).click();
  await expect(page).toHaveURL(/identitas/);

  await page.reload();
  // Still through the guard, not bounced back to the gate.
  await expect(page).toHaveURL(/identitas/);
});

test('the consent step is completable by keyboard alone', async ({ page }) => {
  await page.goto('/daftar/persetujuan');
  const consent = page.getByRole('checkbox', { name: /data pribadi saya diproses/i });
  await consent.focus();
  await page.keyboard.press('Space');
  await expect(consent).toBeChecked();
});
