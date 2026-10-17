import type { Plugin } from 'vite';
import type { BladePluginOptions } from './types.js';

export type { BladePluginOptions };

/**
 * Builds the app's `blade-icons` font from the icons it imports, from
 * `@razorpay/blade-svelte/icons` and from the `extra` folders. Without it,
 * every icon import is its SVG's URL, drawn as a mask.
 *
 * ```ts
 * import bladePlugin from '@razorpay/blade-svelte/configs/vite';
 *
 * export default defineConfig({ plugins: [bladePlugin({ extra: './src/icons' })] });
 * ```
 */
declare function bladePlugin(options?: BladePluginOptions): Plugin[];
export default bladePlugin;
