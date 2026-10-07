import type { Compiler } from 'webpack';
import type { BladeIconFontPluginOptions } from './types.js';

export type { BladeIconFontPluginOptions };

/** The webpack 5 font plugin; `bladeIconFontPlugin()` makes one. */
export declare class BladeIconFontPlugin {
  constructor(options?: BladeIconFontPluginOptions);
  apply(compiler: Compiler): void;
}

/**
 * Builds the app's `blade-icons` font from the icons it imports, from
 * `@razorpay/blade-svelte/icons` and from the `extra` folders. Without it,
 * every icon import is its SVG's URL (give SVGs an asset rule).
 *
 * ```js
 * import { bladeIconFontPlugin } from '@razorpay/blade-svelte/webpack';
 *
 * export default { plugins: [bladeIconFontPlugin({ extra: './src/icons' })] };
 * ```
 */
export declare function bladeIconFontPlugin(options?: BladeIconFontPluginOptions): BladeIconFontPlugin;
export default bladeIconFontPlugin;
