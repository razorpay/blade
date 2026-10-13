import type { Compiler } from 'webpack';
import type { BladePluginOptions } from './types.js';

export type { BladePluginOptions };

/** The webpack 5 font plugin; `bladePlugin()` makes one. */
export declare class BladePlugin {
  constructor(options?: BladePluginOptions);
  apply(compiler: Compiler): void;
}

/**
 * Builds the app's `blade-icons` font from the icons it imports, from
 * `@razorpay/blade-svelte/icons` and from the `extra` folders. Without it,
 * every icon import is its SVG's URL (give SVGs an asset rule).
 *
 * ```js
 * import bladePlugin from '@razorpay/blade-svelte/configs/webpack';
 *
 * export default { plugins: [bladePlugin({ extra: './src/icons' })] };
 * ```
 */
declare function bladePlugin(
  options?: BladePluginOptions,
): BladePlugin;
export default bladePlugin;
