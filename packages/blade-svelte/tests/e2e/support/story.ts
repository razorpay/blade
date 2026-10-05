import type { Page } from '@playwright/test';

/** A story arg as Storybook reads it from the URL. */
type Arg = string | number | boolean;

/**
 * The iframe URL of a src-cx story, relative to the suite's `baseURL`:
 * `storyUrl('components-modal--basic', { isDismissible: false })`. Args use
 * Storybook's URL grammar (`key:value;key:value`); keep values simple — no
 * spaces or reserved characters.
 */
export function storyUrl(id: string, args: Record<string, Arg> = {}): string {
  const params = new URLSearchParams({ id, viewMode: 'story' });
  const entries = Object.entries(args);
  if (entries.length) {
    params.set('args', entries.map(([key, value]) => `${key}:${String(value)}`).join(';'));
  }
  return `iframe.html?${params.toString()}`;
}

/**
 * Opens a story and waits until it has rendered. Fails the test on a page
 * error, so a story that throws while rendering is never mistaken for one
 * that renders nothing.
 */
export async function gotoStory(
  page: Page,
  id: string,
  args: Record<string, Arg> = {},
): Promise<void> {
  const errors: Error[] = [];
  page.on('pageerror', (error) => errors.push(error));
  await page.goto(storyUrl(id, args));
  await page.locator('#storybook-root > *').first().waitFor();
  if (errors.length) {
    throw errors[0];
  }
}
