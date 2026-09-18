/**
 * Tailwind config for Blade's OWN dev surfaces (Storybook / Vitest).
 *
 * This is the exact "standard consumer" integration a downstream Tailwind app uses (Appendix A of
 * the migration plan): pull in Blade's preset and scan Blade's source for the utility classes its
 * CVA definitions reference — no checkout-specific plugin, alias, or hack. It exercises the same
 * preset consumers get, so Storybook is a faithful preview of production styling.
 *
 * preflight is disabled by the preset (a library must not reset a consumer's globals).
 */
module.exports = {
  presets: [require('@razorpay/blade-core/tailwind/preset')],
  content: [
    // blade-svelte components + stories.
    './src/**/*.{svelte,ts,js}',
    // blade-core CVA class strings (badge.ts, button.ts, …) live here as literals.
    '../blade-core/src/**/*.{ts,js}',
  ],
};
