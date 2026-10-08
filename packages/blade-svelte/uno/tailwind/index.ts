/**
 * Tailwind v3, rebuilt as Blade's UnoCSS rules: an app passes its
 * tailwind.config.js theme to `bladeUnoConfig({ theme })` and keeps its
 * classes — colours with `/50` and `*-opacity-*`, type, borders, shadows,
 * rings, gradients, filters, animations — with no Tailwind installed.
 */
export { defaultTheme } from './defaults';
export { resolveTheme, flattenColors } from './theme';
export type { ThemeConfig, ResolvedTheme } from './theme';
export { tailwindRules } from './plugins';
export { preflightCSS, defaultsCSS } from './preflight';
export { customVariants } from './variants';
