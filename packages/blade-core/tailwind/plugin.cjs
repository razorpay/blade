/**
 * Blade Design System — Tailwind plugin for the irreducible "hard cases" (HAND-AUTHORED).
 *
 * ~90% of Blade's rules are atomic-friendly and expressed as CVA class strings. The remaining bits
 * cannot be represented as plain utilities and are emitted here so they live inside the SAME
 * Tailwind build as everything else (no separate stylesheet, no consumer-specific file):
 *   - Button's radial-highlight `::before` and `--btn-accent-*` / `--btn-gradient-*` var bundles
 *   - focus-ring / multi-layer box-shadow stacks
 *   - `@keyframes` + `animation` for the button loader (`btnDots`, `btnProgressRecede`)
 *
 * CVA references the component classes this registers by literal name (e.g. `blade-btn-surface`).
 * Everything references the same `var(--…)` tokens the preset maps, so runtime theming is intact.
 *
 * NOTE: component-class bodies are added in the Button pilot (Phase 1). This file is intentionally a
 * valid, self-contained plugin from Phase 0 so the generated preset can `require()` it.
 */
const plugin = require('tailwindcss/plugin');

module.exports = plugin(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function bladeHardCases({ addComponents, addUtilities, theme }) {
    // Populated in Phase 1 (Button pilot).
  },
  {
    theme: {
      extend: {
        // Button loader animations. Populated in Phase 1 (Button pilot).
        keyframes: {},
        animation: {},
      },
    },
  },
);
