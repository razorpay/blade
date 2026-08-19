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
 * **Button `icon` slot:** set `color` (or a `text-(--token)` utility) on the wrapper; Svelte
 * renders the icon with `currentColor` when this slot is overridden.
 *
 * **Button `text` slot:** same `currentColor` pattern on {@link BaseText} when this slot is overridden.
 *
 * **Typography / Amount:** slot class on wrapper or `className`;
 * inner text/icon uses `currentColor` when that slot override is set so token color classes do not win.
 *
 * **Card `root` — border ring:** elevated surfaces draw the stroke as
 * `box-shadow: inset … var(--interactive-border-gray-disabled)`. Repoint that token on `root`
 * (inherited by the surface) instead of painting `border` or `box-shadow` on `root` directly.
 * Use `variant` and `backgroundColor` for surface fill; `secondary` has no border ring.
 * Interactive-state rings (selected/focused/validation) are also repointable on `root`:
 * `--surface-border-primary-normal` (selected), `--surface-border-primary-muted` (focused),
 * `--interactive-border-negative-default` (error), `--interactive-border-positive-default` (success).
 *
 * @see getPrimaryBrandCssVars — checkout primary token bundle helper
 * @see SAFE_FILLED_BUTTON_ROOT_TOKEN_OVERRIDES — exhaustive safe root token list
 * @see BLADE_SLOT_METADATA — the rules above, per slot, in machine-readable form
 */
export type StyleOverride<Slot extends string> = Partial<Record<Slot, string>>;
