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
 * **Typography / Amount / Badge / Chip / Form label+hint:** slot class on wrapper or `className`;
 * inner text/icon uses `currentColor` when that slot override is set so token color classes do not win.
 *
 * **Card `surface` slot:** include a {@link CardBackgroundColor} token key (e.g.
 * `surface.background.primary.subtle`) in the class string to apply fill through
 * {@link getCardSurfaceClassNames} — same CVA path as `backgroundColor` on `variant="theme"`.
 * Arbitrary classes (e.g. layout) can follow the token in the same string. Raw `background-color`
 * utilities do not replace elevation `background-image`; use a token key or `variant="secondary"`.
 *
 * **Accordion `graySurface` slot:** with `hasGrayBody`, same {@link CardBackgroundColor} token keys
 * route through {@link getAccordionGraySurfaceClassNames} (Blade background utility). **`wrapper`**
 * slot targets the filled outer shell; token adds utility fill but `.filled` gradients remain unless
 * you add `background-image: none` (and optionally tame `box-shadow`) in the same string.
 *
 * @see getPrimaryBrandCssVars — checkout primary token bundle helper
 * @see SAFE_FILLED_BUTTON_ROOT_TOKEN_OVERRIDES — exhaustive safe root token list
 */
export type StyleOverride<Slot extends string> = Partial<Record<Slot, string>>;
