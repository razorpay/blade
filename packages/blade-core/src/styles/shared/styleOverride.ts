/**
 * Per-slot classname overrides merged onto Blade components (provider config + instance prop).
 *
 * **Button `root` — safe token overrides (filled primary CTA):**
 * - `--interactive-background-primary-default|highlighted|disabled`
 * - `--interactive-border-primary-default|highlighted`
 * - Same pattern for `positive` / `negative` accents via {@link getAccentBrandCssVars}
 * - `--btn-progress-surface-backing` when definite-loading on non-default surfaces
 *
 * **Do not** set painted `background-color` / `box-shadow` on `root` — unlayered consumer
 * classes beat `@layer blade` pseudo-state rules. Filled primary "stroke" is inset shadow, not
 * `border-width`; use `variant="secondary"` for outlined CTAs.
 *
 * **Disabled text:** override `--interactive-text-primary-disabled` and
 * `--interactive-icon-primary-disabled` on `root` (or an ancestor). `getButtonTextColorToken`
 * resolves to those paths when `isDisabled`; avoid hard `color` on `styleOverride.text` alone.
 *
 * @see getPrimaryBrandCssVars — checkout primary token bundle helper
 * @see SAFE_FILLED_BUTTON_ROOT_TOKEN_OVERRIDES — exhaustive safe root token list
 */
export type StyleOverride<Slot extends string> = Partial<Record<Slot, string>>;
