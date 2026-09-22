const path = require('path');
const postcssBladeLayer = require('../blade-core/postcss-blade-layer.cjs');

/*
 * PostCSS pipeline for blade-svelte dev (Vite / Storybook / Vitest).
 *
 * - tailwindcss: generates Blade's utility + component classes (from tailwind.config.cjs) into the
 *   `@tailwind` entry (.storybook/tailwind.css). This is the standard consumer path.
 * - autoprefixer: vendor prefixes.
 * - postcssBladeLayer: wraps remaining hand-authored `*.module.css` (components not yet migrated to
 *   Tailwind) in `@layer blade`, preserving the cascade guarantee during the migration.
 */
module.exports = {
  plugins: [
    require('tailwindcss')(path.resolve(__dirname, 'tailwind.config.cjs')),
    require('autoprefixer'),
    postcssBladeLayer,
  ],
};
