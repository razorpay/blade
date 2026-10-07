/**
 * Blade's icons, named as in Blade React: pass one to any `icon`/`source`
 * prop.
 *
 * ```svelte
 * <script>
 *   import { Alert } from '@razorpay/blade-svelte/cx';
 *   import { WalletIcon } from '@razorpay/blade-svelte/icons';
 * </script>
 *
 * <Alert icon={WalletIcon} description="Pay with your wallet balance" />
 * ```
 *
 * Each icon is its SVG file: a URL, drawn as a mask. With `bladeIconFontPlugin`
 * (`@razorpay/blade-svelte/vite` or `/webpack`) in the build, it is a glyph of
 * a font holding exactly the icons the app imports.
 */
export * from './glyphs.js';
export type { BladeIconName } from './names';
export type { IconSource, Glyph } from '../runes/icon/source';
