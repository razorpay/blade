import { test, expect } from '@playwright/test';
import { registerBrowserStackStatusReporter } from './reportStatus';

registerBrowserStackStatusReporter(test);

test('Selectable Card selects a card on click', async ({ page }) => {
  await page.goto('iframe.html?id=components-card-interactive--single-selectable-card');
  const radios = page.getByRole('radio');
  const secondCard = radios.nth(1);

  await expect(radios.first()).toBeVisible();
  // The native radio is visually hidden (clip-rect) inside the Card `as="label"`
  // element. `.check()` tries to interact with the hidden input directly and
  // throws an internal error on BrowserStack's mobile SDK, so click the visible
  // label ancestor (the Card itself) instead — same effect, real tap target.
  const secondCardLabel = secondCard.locator('xpath=ancestor::label[1]');
  await secondCardLabel.click();
  await expect(secondCard).toBeChecked();
});
