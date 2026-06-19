/**
 * AnnouncementBanner — a slim, full-bleed banner for a single short, system-wide
 * promotional or informational message at the top or bottom edge of a page.
 *
 * @example
 * ```svelte
 * <script>
 *   import { AnnouncementBanner } from '@razorpay/blade-svelte';
 *   import { InfoIcon } from '@razorpay/blade-svelte';
 * </script>
 *
 * <AnnouncementBanner icon={InfoIcon} theme="dark" alignment="center">
 *   Enter promotional text here
 * </AnnouncementBanner>
 * ```
 */
export { default as AnnouncementBanner } from './AnnouncementBanner.svelte';
export type {
  AnnouncementBannerProps,
  AnnouncementBannerTheme,
  AnnouncementBannerAlignment,
} from './types';
