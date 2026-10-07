import type { Plugin } from 'vite';
import type { BladeIconFontPluginOptions } from './types.js';

export type { BladeIconFontPluginOptions };

/**
 * Builds the app's `blade-icons` font from the icons it imports, from
 * `@razorpay/blade-svelte/icons` and from the `extra` folders. Without it,
 * every icon import is its SVG's URL, drawn as a mask.
 *
 * ```ts
 * import { bladeIconFontPlugin } from '@razorpay/blade-svelte/vite';
 *
 * export default defineConfig({ plugins: [bladeIconFontPlugin({ extra: './src/icons' })] });
 * ```
 */
export declare function bladeIconFontPlugin(options?: BladeIconFontPluginOptions): Plugin[];
export default bladeIconFontPlugin;
